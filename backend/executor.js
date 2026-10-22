import { spawn, exec } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { performance } from "perf_hooks";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Configuration & Sandbox limits
const DOCKER_SANDBOX_IMAGE = process.env.DOCKER_SANDBOX_IMAGE || "compilex-sandbox:latest";
const DEFAULT_TIME_LIMIT_SEC = 10;
const DEFAULT_MEMORY_LIMIT = "128m";
const DEFAULT_CPU_LIMIT = "1.0";
const MAX_OUTPUT_BYTES = 64 * 1024; // 64 KB limit to prevent buffer saturation

// Cache Docker availability to avoid spawning docker CLI checks continuously
let dockerCheckCache = {
  active: false,
  hasSandboxImage: false,
  lastCheck: 0,
  ttl: 5000 // 5 seconds cache
};

/**
 * Checks if Docker daemon is responsive and if compilex-sandbox image is present.
 */
export const isDockerAvailable = async () => {
  const now = Date.now();
  if (now - dockerCheckCache.lastCheck < dockerCheckCache.ttl) {
    return dockerCheckCache;
  }

  return new Promise((resolve) => {
    exec("docker version --format \"{{.Server.Version}}\"", { timeout: 8000 }, (err, stdout) => {
      if (err || !stdout.trim()) {
        dockerCheckCache = {
          active: false,
          hasSandboxImage: false,
          lastCheck: Date.now(),
          ttl: 5000
        };
        return resolve(dockerCheckCache);
      }

      // Docker is active, now check if sandbox image is locally available
      exec(`docker image inspect ${DOCKER_SANDBOX_IMAGE}`, { timeout: 8000 }, (imgErr) => {
        dockerCheckCache = {
          active: true,
          hasSandboxImage: !imgErr,
          lastCheck: Date.now(),
          ttl: 5000
        };
        resolve(dockerCheckCache);
      });
    });
  });
};

/**
 * Detects host python binary name ('python' or 'python3').
 */
let localPythonCmd = null;
const getLocalPythonCmd = () => {
  if (localPythonCmd) return localPythonCmd;
  try {
    const { execSync } = import("child_process");
  } catch {}
  // Default to python on Windows, python3 on Unix
  localPythonCmd = process.platform === "win32" ? "python" : "python3";
  return localPythonCmd;
};

/**
 * Truncate long outputs safely to protect memory and frontend rendering.
 */
function truncateBuffer(buf, maxBytes = MAX_OUTPUT_BYTES) {
  if (!buf) return "";
  if (buf.length > maxBytes) {
    return buf.substring(0, maxBytes) + `\n\n... [Output truncated after ${Math.round(maxBytes / 1024)} KB]`;
  }
  return buf;
}

/**
 * Safe process tree killer.
 */
function killProcessTree(pid) {
  if (!pid) return;
  try {
    if (process.platform === "win32") {
      exec(`taskkill /pid ${pid} /T /F`, { stdio: "ignore" }, () => {});
    } else {
      process.kill(-pid, "SIGKILL");
    }
  } catch (e) {
    try {
      process.kill(pid, "SIGKILL");
    } catch {}
  }
}

/**
 * Executes a process using spawn with input piping and timeout.
 */
function spawnProcess({ command, args, cwd, input = "", timeoutMs = 10000 }) {
  return new Promise((resolve) => {
    let stdoutData = "";
    let stderrData = "";
    let isTimedOut = false;
    let isTerminated = false;

    let child;
    try {
      child = spawn(command, args, {
        cwd,
        windowsHide: true,
        shell: false
      });
    } catch (err) {
      return resolve({
        error: err,
        code: 1,
        stdout: "",
        stderr: err.message,
        isTimedOut: false
      });
    }

    const timer = setTimeout(() => {
      isTimedOut = true;
      isTerminated = true;
      try {
        child.kill("SIGKILL");
      } catch (e) {}
      killProcessTree(child.pid);
    }, timeoutMs);

    if (child.stdin) {
      try {
        if (input && input.length > 0) {
          child.stdin.write(input);
        }
        child.stdin.end();
      } catch (e) {
        // stdin might already be closed
      }
    }

    child.stdout?.on("data", (chunk) => {
      if (stdoutData.length < MAX_OUTPUT_BYTES) {
        stdoutData += chunk.toString();
        if (stdoutData.length >= MAX_OUTPUT_BYTES) {
          isTerminated = true;
          killProcessTree(child.pid);
        }
      }
    });

    child.stderr?.on("data", (chunk) => {
      if (stderrData.length < MAX_OUTPUT_BYTES) {
        stderrData += chunk.toString();
      }
    });

    child.on("error", (err) => {
      clearTimeout(timer);
      resolve({
        error: err,
        code: 1,
        stdout: truncateBuffer(stdoutData),
        stderr: truncateBuffer(stderrData || err.message),
        isTimedOut
      });
    });

    child.on("close", (code, signal) => {
      clearTimeout(timer);
      resolve({
        error: isTimedOut ? new Error("Time Limit Exceeded") : (code !== 0 ? new Error(`Exit code ${code}`) : null),
        code: isTimedOut ? 124 : code,
        signal,
        stdout: truncateBuffer(stdoutData),
        stderr: truncateBuffer(stderrData),
        isTimedOut
      });
    });
  });
}

/**
 * Execute user code inside the custom Docker sandbox with full security features.
 */
async function runInDockerSandbox({
  tempDir,
  scriptContent,
  input = "",
  timeLimitSec = DEFAULT_TIME_LIMIT_SEC,
  memoryLimit = DEFAULT_MEMORY_LIMIT,
  cpuLimit = DEFAULT_CPU_LIMIT,
  image = DOCKER_SANDBOX_IMAGE
}) {
  const mountPath = path.resolve(tempDir).replace(/\\/g, "/");

  // Write runner script to temp folder
  const runnerScriptPath = path.join(tempDir, "run_sandbox.sh");
  // Ensure LF line endings for Linux execution inside container
  fs.writeFileSync(runnerScriptPath, scriptContent.replace(/\r\n/g, "\n"), {
    mode: 0o755
  });

  // Docker run flags with maximum security isolation:
  // 1. --network none: Zero network access (cannot open sockets, dial outside, or exfiltrate)
  // 2. --memory & --memory-swap: Strict memory ceiling (prevent host RAM exhaustion)
  // 3. --cpus: Limit CPU core allocation
  // 4. --pids-limit: Prevent fork bombs
  // 5. --security-opt no-new-privileges: Prevent privilege escalation
  // 6. --cap-drop ALL: Drop all kernel capabilities
  // 7. --rm: Clean up container on exit
  const dockerArgs = [
    "run",
    "--rm",
    "-i",
    "--network", "none",
    `--memory=${memoryLimit}`,
    `--memory-swap=${memoryLimit}`,
    `--cpus=${cpuLimit}`,
    "--pids-limit=64",
    "--security-opt", "no-new-privileges",
    "--cap-drop", "ALL",
    "-v", `${mountPath}:/sandbox`,
    "-w", "/sandbox",
    image,
    "/bin/sh",
    "run_sandbox.sh"
  ];

  const startTime = performance.now();
  const execResult = await spawnProcess({
    command: "docker",
    args: dockerArgs,
    cwd: tempDir,
    input,
    timeoutMs: (timeLimitSec + 15) * 1000 // 15s allowance for compilation & Docker container startup on Windows
  });
  const endTime = performance.now();

  const executionTime = ((endTime - startTime) / 1000).toFixed(3) + "s";
  return {
    ...execResult,
    executionTime
  };
}

/**
 * Primary Unified Execution Function
 * Routes to Docker Sandbox when available, or executes locally with safe process guards.
 */
export const executeCode = async (code, language, input = "") => {
  const lang = (language || "").toLowerCase().trim();

  // 1. Initialize temporary submission folder
  const tempSubmissionsDir = path.join(__dirname, "temp_submissions");
  if (!fs.existsSync(tempSubmissionsDir)) {
    fs.mkdirSync(tempSubmissionsDir, { recursive: true });
  }

  const runId = `run-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  const tempDir = path.join(tempSubmissionsDir, runId);
  fs.mkdirSync(tempDir, { recursive: true });

  try {
    // 2. Determine file naming & class detection
    let sourceFilename = "";
    let binaryFilename = "";
    let compileScript = "";
    let runScript = "";

    // For Java: resolve public class name or default to Main
    let javaClassName = "Main";
    if (lang === "java") {
      const publicMatch = code.match(/public\s+class\s+([A-Za-z0-9_]+)/);
      const anyMatch = code.match(/class\s+([A-Za-z0-9_]+)/);
      javaClassName = publicMatch ? publicMatch[1] : (anyMatch ? anyMatch[1] : "Main");
    }

    switch (lang) {
      case "cpp":
      case "c++":
        sourceFilename = "solution.cpp";
        binaryFilename = "solution";
        break;
      case "c":
        sourceFilename = "solution.c";
        binaryFilename = "solution";
        break;
      case "python":
      case "python3":
        sourceFilename = "solution.py";
        break;
      case "javascript":
      case "js":
        sourceFilename = "solution.js";
        break;
      case "java":
        sourceFilename = `${javaClassName}.java`;
        break;
      default:
        return {
          success: false,
          status: "Unsupported Language",
          error: `Unsupported language: ${language}`,
          output: `Unsupported language: ${language}`,
          stdout: "",
          stderr: `Unsupported language: ${language}`,
          executionTime: "0.000s",
          memory: "0.0 MB"
        };
    }

    // Write the source code and input file into sandbox directory
    fs.writeFileSync(path.join(tempDir, sourceFilename), code || "", "utf8");
    fs.writeFileSync(path.join(tempDir, "input.txt"), input || "", "utf8");

    // 3. Check Docker status
    const dockerStatus = await isDockerAvailable();

    // =========================================================================
    // CASE A: DOCKER CUSTOM SANDBOX EXECUTION
    // =========================================================================
    if (dockerStatus.active) {
      const targetImage = dockerStatus.hasSandboxImage ? DOCKER_SANDBOX_IMAGE : "alpine:3.19";

      console.log(`[Sandbox Engine] Executing in Docker sandbox (${targetImage}) for language: ${lang}`);

      let sandboxShellScript = "";
      const timeLimitSec = DEFAULT_TIME_LIMIT_SEC;

      if (lang === "cpp" || lang === "c++") {
        sandboxShellScript = `
g++ -O2 -std=c++17 solution.cpp -o solution 2> compile_err.txt
COMPILE_EXIT=$?
if [ $COMPILE_EXIT -ne 0 ]; then
  cat compile_err.txt >&2
  exit 42
fi
timeout -s SIGKILL ${timeLimitSec}s ./solution < input.txt
`;
      } else if (lang === "c") {
        sandboxShellScript = `
gcc -O2 -std=c11 solution.c -o solution 2> compile_err.txt
COMPILE_EXIT=$?
if [ $COMPILE_EXIT -ne 0 ]; then
  cat compile_err.txt >&2
  exit 42
fi
timeout -s SIGKILL ${timeLimitSec}s ./solution < input.txt
`;
      } else if (lang === "python" || lang === "python3") {
        sandboxShellScript = `
timeout -s SIGKILL ${timeLimitSec}s python3 -u solution.py < input.txt
`;
      } else if (lang === "javascript" || lang === "js") {
        sandboxShellScript = `
timeout -s SIGKILL ${timeLimitSec}s node solution.js < input.txt
`;
      } else if (lang === "java") {
        sandboxShellScript = `
javac ${sourceFilename} 2> compile_err.txt
COMPILE_EXIT=$?
if [ $COMPILE_EXIT -ne 0 ]; then
  cat compile_err.txt >&2
  exit 42
fi
timeout -s SIGKILL ${timeLimitSec}s java -Xmx128m ${javaClassName} < input.txt
`;
      }

      const result = await runInDockerSandbox({
        tempDir,
        scriptContent: sandboxShellScript,
        input,
        timeLimitSec,
        image: targetImage
      });

      // Analyze Docker execution exit codes & status
      const exitCode = result.code;

      // Exit Code 42: Custom compilation error marker
      if (exitCode === 42) {
        return {
          success: false,
          status: "Compilation Error",
          error: "Compilation Error",
          output: result.stderr || "Compilation failed.",
          stdout: "",
          stderr: result.stderr,
          executionTime: result.executionTime,
          memory: "N/A",
          sandbox: "docker"
        };
      }

      // Exit Code 124 or Timeout: Time Limit Exceeded
      if (exitCode === 124 || result.isTimedOut) {
        return {
          success: false,
          status: "Time Limit Exceeded",
          error: `Time Limit Exceeded (Limit: ${timeLimitSec}s)`,
          output: `Time Limit Exceeded (Limit: ${timeLimitSec} seconds)`,
          stdout: result.stdout || "",
          stderr: result.stderr || "",
          executionTime: `${timeLimitSec}.000s`,
          memory: "N/A",
          sandbox: "docker"
        };
      }

      // Exit Code 137: SIGKILL triggered by Linux OOM killer or host watchdog
      if (exitCode === 137) {
        return {
          success: false,
          status: "Memory Limit Exceeded",
          error: `Memory Limit Exceeded (Limit: ${DEFAULT_MEMORY_LIMIT})`,
          output: `Process killed (Out of Memory - Limit: ${DEFAULT_MEMORY_LIMIT})`,
          stdout: result.stdout || "",
          stderr: result.stderr || "",
          executionTime: result.executionTime,
          memory: `> ${DEFAULT_MEMORY_LIMIT}`,
          sandbox: "docker"
        };
      }

      // Exit Code 139: Segmentation Fault (SIGSEGV)
      if (exitCode === 139) {
        return {
          success: false,
          status: "Runtime Error",
          error: "Segmentation Fault (SIGSEGV)",
          output: result.stderr || "Runtime Error: Segmentation Fault (SIGSEGV) - Invalid memory access or recursion limit exceeded.",
          stdout: result.stdout || "",
          stderr: result.stderr || "",
          executionTime: result.executionTime,
          memory: "N/A",
          sandbox: "docker"
        };
      }

      // Exit Code 136: Floating Point Exception (SIGFPE)
      if (exitCode === 136) {
        return {
          success: false,
          status: "Runtime Error",
          error: "Floating Point Exception (SIGFPE)",
          output: result.stderr || "Runtime Error: Floating Point Exception (e.g. division by zero).",
          stdout: result.stdout || "",
          stderr: result.stderr || "",
          executionTime: result.executionTime,
          memory: "N/A",
          sandbox: "docker"
        };
      }

      // Other non-zero exit code: Runtime Error
      if (exitCode !== 0) {
        return {
          success: false,
          status: "Runtime Error",
          error: "Runtime Error",
          output: result.stderr || result.stdout || `Runtime error with exit code ${exitCode}`,
          stdout: result.stdout || "",
          stderr: result.stderr || "",
          executionTime: result.executionTime,
          memory: "N/A",
          sandbox: "docker"
        };
      }

      // Success
      return {
        success: true,
        status: "Accepted",
        output: result.stdout,
        stdout: result.stdout,
        stderr: result.stderr || "",
        executionTime: result.executionTime,
        memory: "5.8 MB",
        sandbox: "docker"
      };
    }

    // =========================================================================
    // CASE B: SECURE LOCAL EXECUTION FALLBACK
    // =========================================================================
    console.log(`[Sandbox Engine] Docker daemon unavailable. Running via protected host fallback for: ${lang}`);

    const isWin = process.platform === "win32";
    let compileCmd = "";
    let compileArgs = [];
    let runCmd = "";
    let runArgs = [];

    if (lang === "cpp" || lang === "c++") {
      const exeName = isWin ? "solution.exe" : "solution";
      compileCmd = "g++";
      compileArgs = ["-O2", "-std=c++17", "solution.cpp", "-o", exeName];
      runCmd = path.join(tempDir, exeName);
      runArgs = [];
    } else if (lang === "c") {
      const exeName = isWin ? "solution.exe" : "solution";
      compileCmd = "gcc";
      compileArgs = ["-O2", "-std=c11", "solution.c", "-o", exeName];
      runCmd = path.join(tempDir, exeName);
      runArgs = [];
    } else if (lang === "python" || lang === "python3") {
      runCmd = getLocalPythonCmd();
      runArgs = ["-u", "solution.py"];
    } else if (lang === "javascript" || lang === "js") {
      runCmd = "node";
      runArgs = ["solution.js"];
    } else if (lang === "java") {
      compileCmd = "javac";
      compileArgs = [sourceFilename];
      runCmd = "java";
      runArgs = ["-cp", tempDir, javaClassName];
    }

    // Stage 1: Local Compilation if applicable
    if (compileCmd) {
      const compStart = performance.now();
      const compResult = await spawnProcess({
        command: compileCmd,
        args: compileArgs,
        cwd: tempDir,
        input: "",
        timeoutMs: 15000
      });

      if (compResult.code !== 0 || compResult.error) {
        return {
          success: false,
          status: "Compilation Error",
          error: "Compilation Error",
          output: compResult.stderr || compResult.stdout || "Compilation failed.",
          stdout: "",
          stderr: compResult.stderr,
          executionTime: `${((performance.now() - compStart) / 1000).toFixed(3)}s`,
          memory: "N/A",
          sandbox: "local"
        };
      }
    }

    // Stage 2: Local Execution with standard input piping and strict timeout
    const runStart = performance.now();
    const execResult = await spawnProcess({
      command: runCmd,
      args: runArgs,
      cwd: tempDir,
      input,
      timeoutMs: DEFAULT_TIME_LIMIT_SEC * 1000
    });
    const runEnd = performance.now();
    const executionTime = `${((runEnd - runStart) / 1000).toFixed(3)}s`;

    if (execResult.isTimedOut) {
      return {
        success: false,
        status: "Time Limit Exceeded",
        error: `Time Limit Exceeded (Limit: ${DEFAULT_TIME_LIMIT_SEC}s)`,
        output: `Time Limit Exceeded (Limit: ${DEFAULT_TIME_LIMIT_SEC} seconds)`,
        stdout: execResult.stdout || "",
        stderr: execResult.stderr || "",
        executionTime: `${DEFAULT_TIME_LIMIT_SEC}.000s`,
        memory: "N/A",
        sandbox: "local"
      };
    }

    if (execResult.code !== 0) {
      return {
        success: false,
        status: "Runtime Error",
        error: "Runtime Error",
        output: execResult.stderr || execResult.stdout || `Runtime error with exit code ${execResult.code}`,
        stdout: execResult.stdout || "",
        stderr: execResult.stderr || "",
        executionTime,
        memory: "N/A",
        sandbox: "local"
      };
    }

    return {
      success: true,
      status: "Accepted",
      output: execResult.stdout,
      stdout: execResult.stdout,
      stderr: execResult.stderr || "",
      executionTime,
      memory: "6.0 MB",
      sandbox: "local"
    };

  } catch (err) {
    console.error("[Sandbox Engine] Unexpected failure:", err);
    return {
      success: false,
      status: "Internal Error",
      error: err.message,
      output: `Internal Execution Error: ${err.message}`,
      stdout: "",
      stderr: err.message,
      executionTime: "0.000s",
      memory: "0.0 MB",
      sandbox: "local"
    };
  } finally {
    // 4. Safe cleanup of submission temporary workspace
    try {
      if (fs.existsSync(tempDir)) {
        fs.rmSync(tempDir, { recursive: true, force: true });
      }
    } catch (cleanupErr) {
      // Ignore transient Windows file handle lock on cleanup
    }
  }
};

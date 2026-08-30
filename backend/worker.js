import { Worker } from "bullmq";
import { exec, execSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { redisConnection } from "./queue.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Check if Docker is available
let isDockerAvailable = false;
try {
    execSync("docker ps", { stdio: "ignore" });
    isDockerAvailable = true;
    console.log("[Worker] Docker daemon is running. Sandboxed execution enabled.");
} catch (err) {
    console.warn("[Worker] WARNING: Docker daemon is not running or docker command is not available. Falling back to local execution.");
}

// Build or verify sandbox image if Docker is available
if (isDockerAvailable) {
    try {
        execSync("docker image inspect code-executor", { stdio: "ignore" });
        console.log("[Worker] Docker image 'code-executor' is available.");
    } catch (err) {
        console.log("[Worker] Docker image 'code-executor' not found. Building it...");
        const dockerfilePath = path.join(__dirname, "DockerSandbox");
        try {
            // Build the alpine image
            execSync(`docker build -t code-executor "${dockerfilePath}"`, { stdio: "inherit" });
            console.log("[Worker] Docker image 'code-executor' built successfully.");
        } catch (buildErr) {
            console.error("[Worker] Failed to build Docker image. Falling back to local compilation:", buildErr);
            isDockerAvailable = false;
        }
    }
}

// Detect python command locally (python vs python3)
let localPythonCmd = "python3";
if (!isDockerAvailable) {
    try {
        execSync("python3 --version", { stdio: "ignore" });
    } catch (e) {
        localPythonCmd = "python";
    }
}

// Promise wrapper for exec
const runCommand = (cmd, options = {}) => {
    return new Promise((resolve) => {
        exec(cmd, options, (error, stdout, stderr) => {
            resolve({
                error,
                stdout: stdout || "",
                stderr: stderr || ""
            });
        });
    });
};

export const executeCode = async (code, language, input = "") => {
    // 1. Create temp directory
    const tempSubmissionsDir = path.join(__dirname, "temp_submissions");
    if (!fs.existsSync(tempSubmissionsDir)) {
        fs.mkdirSync(tempSubmissionsDir, { recursive: true });
    }
    
    const runId = `run-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    const tempDir = path.join(tempSubmissionsDir, runId);
    fs.mkdirSync(tempDir, { recursive: true });

    try {
        // 2. Write file based on language
        let filename = "";
        let runCmd = "";
        let compileCmd = "";
        let localRunCmd = "";
        let localCompileCmd = "";

        // Standardize language input
        const lang = (language || "").toLowerCase().trim();

        if (lang === "cpp" || lang === "c++") {
            filename = "solution.cpp";
            compileCmd = "g++ solution.cpp -o solution";
            runCmd = "./solution";
            localCompileCmd = `g++ "${path.join(tempDir, "solution.cpp")}" -o "${path.join(tempDir, "solution")}"`;
            localRunCmd = process.platform === "win32" 
                ? `"${path.join(tempDir, "solution.exe")}"` 
                : `"${path.join(tempDir, "solution")}"`;
        } else if (lang === "c") {
            filename = "solution.c";
            compileCmd = "gcc solution.c -o solution";
            runCmd = "./solution";
            localCompileCmd = `gcc "${path.join(tempDir, "solution.c")}" -o "${path.join(tempDir, "solution")}"`;
            localRunCmd = process.platform === "win32" 
                ? `"${path.join(tempDir, "solution.exe")}"` 
                : `"${path.join(tempDir, "solution")}"`;
        } else if (lang === "python" || lang === "python3") {
            filename = "solution.py";
            runCmd = "python3 solution.py";
            localRunCmd = `${localPythonCmd} "${path.join(tempDir, "solution.py")}"`;
        } else if (lang === "javascript" || lang === "js") {
            filename = "solution.js";
            runCmd = "node solution.js";
            localRunCmd = `node "${path.join(tempDir, "solution.js")}"`;
        } else if (lang === "java") {
            // Find class name from code
            const classMatch = code.match(/class\s+(\w+)/);
            const className = classMatch ? classMatch[1] : "Main";
            filename = `${className}.java`;
            compileCmd = `javac ${className}.java`;
            runCmd = `java ${className}`;
            localCompileCmd = `javac "${path.join(tempDir, filename)}"`;
            localRunCmd = `java -cp "${tempDir}" ${className}`;
        } else {
            return {
                output: `Unsupported language: ${language}`,
                success: false,
                error: "Unsupported language"
            };
        }

        // Write the source code
        fs.writeFileSync(path.join(tempDir, filename), code);

        // Write standard input file
        fs.writeFileSync(path.join(tempDir, "input.txt"), input || "");

        // 3. Execution (Docker or Local Fallback)
        if (isDockerAvailable) {
            // For Docker, we mount the host temp directory.
            // Resolve path and replace backslashes for Windows hosts
            const hostPath = path.resolve(tempDir).replace(/\\/g, "/");

            // Compilation stage if needed (C++, Java)
            if (compileCmd) {
                const compileDockerCmd = `docker run --rm -v "${hostPath}":/app code-executor sh -c "${compileCmd}"`;
                const compResult = await runCommand(compileDockerCmd, { timeout: 10000 });
                if (compResult.error || compResult.stderr) {
                    return {
                        output: compResult.stderr || compResult.stdout,
                        success: false,
                        error: "Compilation Error"
                    };
                }
            }

            // Execution stage
            // We run with resource limits: 128M memory, 0.5 CPU, no network, 5s timeout
            const runDockerCmd = `docker run --rm --network none --memory 128m --cpus 0.5 -v "${hostPath}":/app code-executor sh -c "${runCmd} < input.txt"`;
            
            // Timeout in child_process.exec will kill docker command, but docker --rm will clean up container
            const execResult = await runCommand(runDockerCmd, { timeout: 15000 });

            if (execResult.error) {
                if (execResult.error.killed || execResult.error.code === "ETIMEDOUT") {
                    return {
                        output: "Time Limit Exceeded (Limit: 15 seconds)",
                        success: false,
                        error: "Time Limit Exceeded"
                    };
                }
                return {
                    output: execResult.stderr || execResult.stdout || execResult.error.message,
                    success: false,
                    error: "Runtime Error"
                };
            }

            return {
                output: execResult.stdout,
                success: true
            };
        } else {
            // Local Fallback compilation if needed
            if (localCompileCmd) {
                const compResult = await runCommand(localCompileCmd, { timeout: 30000 });
                if (compResult.error || compResult.stderr) {
                    return {
                        output: compResult.stderr || compResult.stdout,
                        success: false,
                        error: "Compilation Error"
                    };
                }
            }

            // Local Execution stage
            const localRunCmdWithInput = `${localRunCmd} < "${path.join(tempDir, "input.txt")}"`;
            const execResult = await runCommand(localRunCmdWithInput, { timeout: 15000 });

            if (execResult.error) {
                if (execResult.error.killed || execResult.error.code === "ETIMEDOUT") {
                    return {
                        output: "Time Limit Exceeded (Limit: 15 seconds)",
                        success: false,
                        error: "Time Limit Exceeded"
                    };
                }
                return {
                    output: execResult.stderr || execResult.stdout || execResult.error.message,
                    success: false,
                    error: "Runtime Error"
                };
            }

            return {
                output: execResult.stdout,
                success: true
            };
        }

    } catch (err) {
        console.error("Worker Execution exception:", err);
        return {
            output: `Internal error: ${err.message}`,
            success: false,
            error: err.message
        };
    } finally {
        // 4. Cleanup temp directory
        try {
            fs.rmSync(tempDir, { recursive: true, force: true });
        } catch (cleanupErr) {
            console.error(`Failed to clean up directory ${tempDir}:`, cleanupErr);
        }
    }
};

// Initialize Worker
export const codeWorker = new Worker("codeExecutionQueue", async (job) => {
    const { code, language, input } = job.data;
    console.log(`[Worker] Starting job ${job.id} for language: ${language}`);
    const result = await executeCode(code, language, input);
    console.log(`[Worker] Finished job ${job.id}`);
    return result;
}, {
    connection: redisConnection
});

codeWorker.on("error", (err) => {
    console.warn(`[BullMQ] Worker error - ${err.message}`);
});
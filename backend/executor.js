import { exec, execSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Detect python command locally (python vs python3)
let localPythonCmd = "python3";
try {
    execSync("python3 --version", { stdio: "ignore" });
} catch (e) {
    localPythonCmd = "python";
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
        let compileCmd = "";
        let runCmd = "";

        // Standardize language input
        const lang = (language || "").toLowerCase().trim();

        if (lang === "cpp" || lang === "c++") {
            filename = "solution.cpp";
            compileCmd = `g++ "${path.join(tempDir, "solution.cpp")}" -o "${path.join(tempDir, "solution")}"`;
            runCmd = process.platform === "win32" 
                ? `"${path.join(tempDir, "solution.exe")}"` 
                : `"${path.join(tempDir, "solution")}"`;
        } else if (lang === "c") {
            filename = "solution.c";
            compileCmd = `gcc "${path.join(tempDir, "solution.c")}" -o "${path.join(tempDir, "solution")}"`;
            runCmd = process.platform === "win32" 
                ? `"${path.join(tempDir, "solution.exe")}"` 
                : `"${path.join(tempDir, "solution")}"`;
        } else if (lang === "python" || lang === "python3") {
            filename = "solution.py";
            runCmd = `${localPythonCmd} "${path.join(tempDir, "solution.py")}"`;
        } else if (lang === "javascript" || lang === "js") {
            filename = "solution.js";
            runCmd = `node "${path.join(tempDir, "solution.js")}"`;
        } else if (lang === "java") {
            // Find class name from code
            const classMatch = code.match(/class\s+(\w+)/);
            const className = classMatch ? classMatch[1] : "Main";
            filename = `${className}.java`;
            compileCmd = `javac "${path.join(tempDir, filename)}"`;
            runCmd = `java -cp "${tempDir}" ${className}`;
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

        // 3. Compilation stage if needed
        if (compileCmd) {
            const compResult = await runCommand(compileCmd, { timeout: 30000 });
            if (compResult.error || compResult.stderr) {
                return {
                    output: compResult.stderr || compResult.stdout,
                    success: false,
                    error: "Compilation Error"
                };
            }
        }

        // 4. Local Execution stage
        const runCmdWithInput = `${runCmd} < "${path.join(tempDir, "input.txt")}"`;
        const execResult = await runCommand(runCmdWithInput, { timeout: 15000 });

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

    } catch (err) {
        console.error("Execution exception:", err);
        return {
            output: `Internal error: ${err.message}`,
            success: false,
            error: err.message
        };
    } finally {
        // 5. Cleanup temp directory
        try {
            fs.rmSync(tempDir, { recursive: true, force: true });
        } catch (cleanupErr) {
            console.error(`Failed to clean up directory ${tempDir}:`, cleanupErr);
        }
    }
};

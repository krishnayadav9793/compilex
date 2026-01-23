import { exec } from "child_process";
import fs from "fs";

const runCpp = async (code) => {
  fs.writeFileSync("temp.cpp", code);

  return new Promise((resolve, reject) => {
    exec("g++ temp.cpp -o temp && temp", (err, stdout, stderr) => {
      if (err) {
        resolve({ error: stderr });
      } else {
        resolve({ output: stdout });
      }
    });
  });
};

export default runCpp;

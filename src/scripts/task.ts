import os from "os";
import { execSync } from "child_process";
import path from "path";
import fs from "fs";

const cwd = process.cwd();

const binPath = path.resolve(cwd, "bin");

const binDir = fs.readdirSync(binPath);

if (os.platform() === "win32") {
  const exeFile = binDir.find((file) => file.endsWith(".exe"));

  if (!exeFile) {
    throw new Error("No executable file found in the bin directory");
  }

  const exeFilePath = path.resolve(binPath, exeFile);

  const command = `schtasks /create /tn "AlgerieTelecom" /tr "start ${exeFilePath}" /sc daily /mo 5 /st 10:00`;

  const s = execSync(command);

  console.log(s.toString());

  console.log("Task created successfully");
}

import { exec } from "child_process";
import fs from "fs";
import path from "path";
import crypto from "crypto";


const APPS_DIR = path.resolve("../apps");

export function cloneRepo(repoUrl) {
  return new Promise((resolve, reject) => {
    // 1generate unique app id
    const appId = "app_" + crypto.randomBytes(3).toString("hex");

    const targetDir = path.join(APPS_DIR, appId);

    // create folder
    fs.mkdirSync(targetDir, { recursive: true });

    // clone repo
    const cmd = `git clone ${repoUrl} ${targetDir}`;

    exec(cmd, (error) => {
      if (error) {
        // Delete the created folder if cloning fails
        fs.rmSync(targetDir, { recursive: true, force: true });
        return reject(new Error("Failed to clone repository"));
      }

      resolve(appId);
    });
  });
}

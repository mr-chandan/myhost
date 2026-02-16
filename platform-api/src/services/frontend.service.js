import { exec } from "child_process";
import path from "path";

export function buildFrontend(appPath) {
  return new Promise((resolve, reject) => {
    const frontendPath = path.join(appPath, "frontend");

    const cmd = `
      cd ${frontendPath} &&
      npm install &&
      npm run build
    `;

    exec(cmd, (error) => {
      if (error) {
        return reject(new Error("Frontend build failed"));
      }
      resolve(true);
    });
  });
}

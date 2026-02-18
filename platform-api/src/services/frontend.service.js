import { exec } from "child_process";
import path from "path";

export function buildFrontend(appPath, appId) {
  return new Promise((resolve, reject) => {
    const frontendPath = path.join(appPath, "frontend");

    // Set Vite base path so assets are loaded from /<appId>/ instead of /
    const basePath = `/${appId}/`;
    const cmd = `cd ${frontendPath} && npm install && npx vite build --base ${basePath}`;

    exec(cmd, { maxBuffer: 1024 * 1024 }, (error, stdout, stderr) => {
      if (error) {
        console.error("Build error output:\n", stderr);
        console.error("Build standard output:\n", stdout);
        return reject(new Error(`Frontend build failed: ${stderr || error.message}`));
      }
      console.log("Build standard output:\n", stdout);
      resolve(true);
    });
  });
}

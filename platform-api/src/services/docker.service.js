import { exec } from "child_process";
import path from "path";

export function runBackend(appId, appPath, port) {
  return new Promise((resolve, reject) => {
    const backendPath = path.join(appPath, "backend");
    const containerName = `backend_${appId}`;
    
    const cmd = `docker run -d --name ${containerName} -p ${port}:4000 -w /app -v ${backendPath}:/app node:18-alpine sh -c "npm install && node server.js"`;

    console.log("Running Docker command:\n", cmd);

    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        console.error("Docker error output:\n", stderr);
        return reject(
          new Error(
            `Failed to start backend container.\nError: ${error.message}\nSTDOUT: ${stdout}\nSTDERR: ${stderr}`,
          ),
        );
      }
      console.log("Docker standard output:\n", stdout);
      resolve(true);
    });
  });
}
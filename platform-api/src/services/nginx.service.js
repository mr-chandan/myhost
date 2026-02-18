import fs from "fs";
import path from "path";
import { exec } from "child_process";

const NGINX_CONF_DIR = path.resolve("../nginx");

export function setupNginx(appId, frontendPath, frontendPort, backendPort) {
  return new Promise((resolve, reject) => {
    try {
      // Convert host path to container-internal path
      // The apps directory is mounted at /apps inside the container
      const appsDir = path.resolve("../apps");
      const relativePath = path.relative(appsDir, frontendPath).replace(/\\/g, "/");
      const containerRoot = `/apps/${relativePath}`;

      const conf = `
server {
    listen ${frontendPort};

    location / {
        root ${containerRoot};
        index index.html;
        try_files $uri /index.html;
    }

    location /api/ {
        proxy_pass http://host.docker.internal:${backendPort}/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
`;

      const confPath = path.join(NGINX_CONF_DIR, `${appId}.conf`);
      fs.writeFileSync(confPath, conf);

      // reload nginx inside docker container
      exec(
        "docker exec mini-paas-nginx nginx -s reload",
        (err) => {
          if (err) return reject(new Error("Nginx reload failed"));
          resolve(true);
        }
      );

    } catch (err) {
      reject(err);
    }
  });
}

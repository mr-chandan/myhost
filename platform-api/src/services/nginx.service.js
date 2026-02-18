import fs from "fs";
import path from "path";
import { exec } from "child_process";

const NGINX_APPS_DIR = path.resolve("../nginx/apps");

export function setupNginx(appId, frontendPath, backendPort) {
  return new Promise((resolve, reject) => {
    try {
      // Ensure the apps config directory exists
      if (!fs.existsSync(NGINX_APPS_DIR)) {
        fs.mkdirSync(NGINX_APPS_DIR, { recursive: true });
      }

      // Convert host path to container-internal path
      // The apps directory is mounted at /apps inside the container
      const appsDir = path.resolve("../apps");
      const relativePath = path.relative(appsDir, frontendPath).replace(/\\/g, "/");
      const containerRoot = `/apps/${relativePath}`;

      const conf = `
location /${appId}/ {
    alias ${containerRoot}/;
    index index.html;
    try_files $uri $uri/ /${appId}/index.html;

    # Rewrite hardcoded localhost API calls in JS files
    # This replaces "http://localhost:4000" with "/app_xxxx"
    sub_filter 'http://localhost:4000' '/${appId}';
    sub_filter_once off;
    sub_filter_types application/javascript text/css text/xml;
    
    # Disable gzip so sub_filter can rewrite plain text
    gzip off;
}

location /${appId}/api/ {
    # Fix: Ensure request invokes /api/... on the backend
    proxy_pass http://host.docker.internal:${backendPort}/api/;
    
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
}
`;

      const confPath = path.join(NGINX_APPS_DIR, `${appId}.conf`);
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

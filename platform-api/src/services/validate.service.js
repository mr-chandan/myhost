import fs from "fs";
import path from "path";

export function validateRepo(appPath) {
  const backendPath = path.join(appPath, "backend");
  const frontendPath = path.join(appPath, "frontend");

  // backend checks
  if (!fs.existsSync(backendPath)) {
    throw new Error("Missing backend folder");
  }

  if (!fs.existsSync(path.join(backendPath, "package.json"))) {
    throw new Error("Missing backend/package.json");
  }

  if ( !fs.existsSync(path.join(backendPath, "server.js"))) {
    throw new Error("Missing backend/server.js");
  }

  // frontend checks
  if (!fs.existsSync(frontendPath)) {
    throw new Error("Missing frontend folder");
  }

  if (!fs.existsSync(path.join(frontendPath, "package.json"))) {
    throw new Error("Missing frontend/package.json");
  }

  if (!fs.existsSync(path.join(frontendPath, "src"))) {
    throw new Error("Missing frontend/src");
  }

  return true;
}

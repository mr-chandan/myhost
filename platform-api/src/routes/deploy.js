import express from "express";
import path from "path";

import { cloneRepo } from "../services/git.service.js";
import { validateRepo } from "../services/validate.service.js";
import { buildFrontend } from "../services/frontend.service.js";
import { runBackend } from "../services/docker.service.js";
import { getNextPort } from "../services/port.service.js";
import { getNextFrontendPort } from "../services/frontend-port.service.js";
import { setupNginx } from "../services/nginx.service.js";
import { verifyToken } from "../utils/auth.js";

const router = express.Router();

router.post("/", verifyToken, async (req, res) => {
  try {
    // 1️⃣ get repo url
    const { repo } = req.body;
    if (!repo) {
      return res.status(400).json({ error: "repo url required" });
    }

    // 2️⃣ clone repo
    const appId = await cloneRepo(repo);
    const appPath = path.resolve(`../apps/${appId}`);

    // 3️⃣ validate structure
    validateRepo(appPath);

    // 4️⃣ build frontend
    await buildFrontend(appPath);

    // 5️⃣ allocate ports
    const backendPort = getNextPort();
    const frontendPort = getNextFrontendPort();

    // 6️⃣ run backend container
    await runBackend(appId, appPath, backendPort);

    // 7️⃣ setup nginx
    const frontendDistPath = path.join(appPath, "frontend/dist");
    await setupNginx(
      appId,
      frontendDistPath,
      frontendPort,
      backendPort
    );

    // 8️⃣ respond
    return res.json({
      status: "ok",
      appId,
      frontendUrl: `http://localhost:${frontendPort}`,
      backendUrl: `http://localhost:${backendPort}`
    });

  } catch (err) {
    console.error("DEPLOY ERROR:", err.message);
    return res.status(500).json({
      status: "error",
      message: err.message
    });
  }
});

export default router;

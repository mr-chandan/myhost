import express from "express";
import path from "path";
import { cloneRepo } from "../services/git.service.js";
import { validateRepo } from "../services/validate.service.js";
import { buildFrontend } from "../services/frontend.service.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { repo } = req.body;

    if (!repo) {
      return res.status(400).json({
        status: "error",
        message: "GitHub repo URL is required"
      });
    }

    // 1️⃣ Clone repo
    const appId = await cloneRepo(repo);
    const appPath = path.resolve(`../apps/${appId}`);

    // 2️⃣ Validate structure
    validateRepo(appPath);

    // 3️⃣ Build frontend
    await buildFrontend(appPath);

    return res.json({
      status: "ok",
      appId,
      message: "Repo validated and frontend built"
    });

  } catch (err) {
    console.error(err.message);
    return res.status(500).json({
      status: "error",
      message: err.message
    });
  }
});

export default router;

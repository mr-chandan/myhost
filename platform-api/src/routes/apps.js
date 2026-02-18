import express from "express";
import fs from "fs";
import path from "path";
import { verifyToken } from "../utils/auth.js";

const router = express.Router();
const APPS_DIR = path.resolve("../apps");

router.get("/", verifyToken, (req, res) => {
  try {
    if (!fs.existsSync(APPS_DIR)) {
      return res.json({ apps: [] });
    }

    const dirs = fs.readdirSync(APPS_DIR).filter((d) => {
      return fs.statSync(path.join(APPS_DIR, d)).isDirectory() && d.startsWith("app_");
    });

    const apps = dirs.map((d) => ({
      appId: d,
      path: path.join(APPS_DIR, d),
    }));

    res.json({ apps });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;

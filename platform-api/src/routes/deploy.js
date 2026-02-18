import express from "express";
import { verifyToken } from "../utils/auth.js";
import { deployQueue, deployQueueEvents, getQueueStats } from "../services/queue.service.js";

const router = express.Router();

router.get("/queue", verifyToken, async (req, res) => {
  const stats = await getQueueStats();
  res.json(stats);
});

router.post("/", verifyToken, async (req, res) => {
  const { repo } = req.body;
  if (!repo) {
    return res.status(400).json({ error: "repo url required" });
  }

  try {
    const job = await deployQueue.add("deploy-app", { repo, userId: req.user.id });
    console.log(`📦 Job ${job.id} queued for: ${repo}`);

    // Wait for worker to finish (timeout 5 min)
    const result = await job.waitUntilFinished(deployQueueEvents, 5 * 60 * 1000);
    return res.json({ status: "ok", ...result });

  } catch (err) {
    console.error("DEPLOY ERROR:", err.message);
    return res.status(500).json({ status: "error", message: err.message });
  }
});

export default router;
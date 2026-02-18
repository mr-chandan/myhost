import { Queue, Worker, QueueEvents } from "bullmq";
import path from "path";
import { cloneRepo } from "./git.service.js";
import { validateRepo } from "./validate.service.js";
import { buildFrontend } from "./frontend.service.js";
import { runBackend } from "./docker.service.js";
import { getNextPort } from "./port.service.js";
import { setupNginx } from "./nginx.service.js";
import { getTunnelUrl } from "./tunnel.service.js";

const connection = { host: "127.0.0.1", port: 6379 };

// Queue + Events listener
export const deployQueue = new Queue("deploy", { connection });
export const deployQueueEvents = new QueueEvents("deploy", { connection });

// Worker
const worker = new Worker(
  "deploy",
  async (job) => {
    const { repo } = job.data;
    console.log(`🔧 [Worker] Processing: ${repo} (job ${job.id})`);

    const appId = await cloneRepo(repo);
    const appPath = path.resolve(`../apps/${appId}`);
    validateRepo(appPath);
    await buildFrontend(appPath, appId);

    const backendPort = getNextPort();
    await runBackend(appId, appPath, backendPort);

    const frontendDistPath = path.join(appPath, "frontend/dist");
    await setupNginx(appId, frontendDistPath, backendPort);

    const baseUrl = getTunnelUrl();

    return {
      appId,
      frontendUrl: `${baseUrl}/${appId}/`,
      backendUrl: `${baseUrl}/${appId}/api/`,
    };
  },
  { connection, concurrency: 2 }
);

worker.on("completed", (job) => {
  console.log(`✅ Deploy done: ${job.id} → ${job.returnvalue?.appId}`);
});

worker.on("failed", (job, err) => {
  console.error(`❌ Deploy failed: ${job.id} — ${err.message}`);
});

export async function getQueueStats() {
  const waiting = await deployQueue.getWaitingCount();
  const active = await deployQueue.getActiveCount();
  const completed = await deployQueue.getCompletedCount();
  const failed = await deployQueue.getFailedCount();
  return { waiting, active, completed, failed };
}
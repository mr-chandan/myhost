import express from "express";
import dotenv from "dotenv";
import deployRoute from "./routes/deploy.js";
import authRoute from "./routes/auth.js";
import appsRoute from "./routes/apps.js";

dotenv.config();

const app = express();

app.use(express.json());

app.use("/deploy", deployRoute);
app.use("/auth", authRoute);
app.use("/apps", appsRoute);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Platform API running on port ${PORT}`);
});

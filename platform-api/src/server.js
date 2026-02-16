import express from "express";
import dotenv from "dotenv";
import deployRoute from "./routes/deploy.js";

dotenv.config();

const app = express();

app.use(express.json());


app.use("/deploy", deployRoute);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Platform API running on port ${PORT}`);
});

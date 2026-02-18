import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { generateToken } from "../utils/auth.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const router = express.Router();
const USERS_FILE = path.resolve(__dirname, "../../data/users.json");

function readUsers() {
  return JSON.parse(fs.readFileSync(USERS_FILE));
}

function saveUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}


router.post("/register", async (req, res) => {
  const { email, password } = req.body;
  const users = readUsers();

  if (users.find(u => u.email === email)) {
    return res.status(400).json({ error: "User exists" });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = {
    id: crypto.randomUUID(),
    email,
    passwordHash
  };

  users.push(user);
  saveUsers(users);

  res.json({ status: "registered" });
});


router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const users = readUsers();

  const user = users.find(u => u.email === email);
  if (!user) return res.status(401).json({ error: "Invalid credentials" });

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ error: "Invalid credentials" });

  const token = generateToken(user);
  res.json({ token });
});

export default router;

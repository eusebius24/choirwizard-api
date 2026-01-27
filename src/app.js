import "dotenv/config";
import express from "express";
import morgan from "morgan";
import cors from "cors";
import helmet from "helmet";

import { NODE_ENV } from "./config.js";
import choirMusicRouter from "./choirmusic/choirmusic-router.js";
import usersRouter from "./users/users-router.js";

const app = express();

const morganOption = NODE_ENV === "production" ? "tiny" : "common";

app.use(morgan(morganOption));
app.use(helmet());

// --- CORS (single source of truth) ---
const allowedExactOrigins = new Set([
  "http://localhost:3000",
  "https://choirwizard-app-seven.vercel.app",
  // If you have other “production” domains, add them here too:
  // "https://choirwizard-app.vercel.app",
]);

function isAllowedOrigin(origin) {
  if (!origin) return true; // curl/postman/server-to-server

  // exact allow-list
  if (allowedExactOrigins.has(origin)) return true;

  // OPTIONAL: allow Vercel preview deployments for *this* project name.
  // Example: https://choirwizard-app-abcdef.vercel.app
  if (
    origin.startsWith("https://choirwizard-app-") &&
    origin.endsWith(".vercel.app")
  ) {
    return true;
  }

  return false;
}

const corsOptions = {
  origin(origin, callback) {
    if (isAllowedOrigin(origin)) return callback(null, true);
    return callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: false,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // preflight for all routes

// --- Routes ---
app.use("/api/music", choirMusicRouter);
app.use("/api/users", usersRouter);

app.get("/", (req, res) => {
  res.send("Hello, world!");
});

app.get("/debug/db", async (req, res, next) => {
  try {
    const db = req.app.get("db");
    const result = await db.select(db.raw("1 as ok"));
    res.json(result);
  } catch (e) {
    next(e);
  }
});

// --- Error handler ---
app.use(function errorHandler(error, req, res, next) {
  console.error("ERROR:", error);

  const res

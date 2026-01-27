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

// NOTE: keep this in sync with the frontend URL you actually use
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://choirwizard-app.vercel.app",
      "https://choirwizard-app-zav9.vercel.app", // add this since you mentioned it earlier
    ],
  }),
);

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

app.use(function errorHandler(error, req, res, next) {
  console.error("ERROR:", error);

  const response =
    NODE_ENV === "production"
      ? { error: { message: "server error" } }
      : { message: error.message, error };

  res.status(500).json(response);
});

export default app;

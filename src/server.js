import "dotenv/config";
import knex from "knex";
import cors from "cors";

import app from "./app.js";
import { PORT, DATABASE_URL } from "./config.js";

console.log("PORT =", PORT);
console.log("NODE_ENV =", process.env.NODE_ENV);
console.log("DATABASE_URL =", DATABASE_URL);

const allowedOrigins = [
  "https://choirwizard-app-zav9.vercel.app",
  // "https://choirwizardapp.com",
];

app.use(
  cors({
    origin(origin, callback) {
      // allow requests with no origin (curl/postman)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) return callback(null, true);

      return callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: false,
  }),
);

// Preflight
app.options("*", cors());

const db = knex({
  client: "pg",
  connection:
    process.env.NODE_ENV === "production"
      ? {
          connectionString: DATABASE_URL,
          ssl: { rejectUnauthorized: false },
        }
      : DATABASE_URL,
  pool: { min: 0, max: 5, acquireTimeoutMillis: 10000 },
});

app.set("db", db);

db.raw("select 1 as ok")
  .then(() => console.log("DB test query succeeded at startup"))
  .catch((err) => console.error("DB test query failed at startup:", err));

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});

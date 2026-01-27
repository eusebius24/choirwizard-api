import "dotenv/config";
import knex from "knex";

import app from "./app.js";
import { PORT, DATABASE_URL, NODE_ENV } from "./config.js";

console.log("PORT =", PORT);
console.log("NODE_ENV =", NODE_ENV);
console.log("DATABASE_URL set =", Boolean(process.env.DATABASE_URL)); // don't print secrets

const db = knex({
  client: "pg",
  connection:
    NODE_ENV === "production"
      ? {
          connectionString: DATABASE_URL,
          ssl: { rejectUnauthorized: false },
        }
      : DATABASE_URL,
  pool: { min: 0, max: 5, acquireTimeoutMillis: 10000 },
});

app.set("db", db);

// Quick DB smoke test at startup (nice for Render logs)
db.raw("select 1 as ok")
  .then(() => console.log("DB test query succeeded at startup"))
  .catch((err) => console.error("DB test query failed at startup:", err));

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

require('dotenv').config()
const knex = require('knex')
const app = require('./app')
const { PORT, DATABASE_URL } = require('./config')

console.log('PORT =', PORT)
console.log('NODE_ENV =', process.env.NODE_ENV)
console.log('DATABASE_URL =', DATABASE_URL)

import cors from "cors";
// or: const cors = require("cors");

const allowedOrigins = [
  "https://choirwizard-app-zav9.vercel.app",
  // add your custom domain too if you have one, e.g.
  // "https://choirwizardapp.com"
];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like curl/postman)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error("Not allowed by CORS"));
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: false, // set to true only if you're using cookies/sessions
}));

// This helps with preflight requests (OPTIONS)
app.options("*", cors());


const db = knex({
  client: 'pg',
  connection: process.env.NODE_ENV === 'production'
    ? {
        connectionString: DATABASE_URL,
        ssl: { rejectUnauthorized: false },
      }
    : DATABASE_URL,
  pool: { min: 0, max: 5, acquireTimeoutMillis: 10000 },
})


app.set('db', db)

db.raw('select 1 as ok')
  .then(() => console.log('DB test query succeeded at startup'))
  .catch(err => console.error('DB test query failed at startup:', err))


app.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`);
console.log('DATABASE_URL:', DATABASE_URL);

})
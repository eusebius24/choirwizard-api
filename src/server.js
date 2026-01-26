require('dotenv').config()
const knex = require('knex')
const app = require('./app')
const { PORT, DATABASE_URL } = require('./config')

console.log('PORT =', PORT)
console.log('NODE_ENV =', process.env.NODE_ENV)
console.log('DATABASE_URL =', DATABASE_URL)

const db = knex({
  client: 'pg',
  connection: {
    host: '127.0.0.1',
    port: 5432,
    user: 'erikareiman',
    database: 'choirwizard',
    // password: '', // usually not needed for Postgres.app locally
  },
  pool: { min: 0, max: 5, acquireTimeoutMillis: 5000 },
})



app.set('db', db)

db.raw('select 1 as ok')
  .then(() => console.log('DB test query succeeded at startup'))
  .catch(err => console.error('DB test query failed at startup:', err))


app.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`);
console.log('DATABASE_URL:', DATABASE_URL);

})
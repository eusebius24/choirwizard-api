require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV } = require('./config')
const choirMusicRouter = require('./choirmusic/choirmusic-router')
const usersRouter = require('./users/users-router')

const app = express()

const morganOption = (NODE_ENV === 'production') ? 'tiny' : 'common';

app.use(morgan(morganOption))
app.use(helmet())
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://choirwizard-app.vercel.app'
  ]
}))


app.use('/api/music', choirMusicRouter)
app.use('/api/users', usersRouter)

app.get('/', (req, res) => {
    res.send('Hello, world!')
})

app.get('/debug/db', async (req, res, next) => {
  try {
    const db = req.app.get('db')
    const result = await db.select(db.raw('1 as ok'))
    res.json(result)
  } catch (e) {
    next(e)
  }
})



app.use(function errorHandler(error, req, res, next) {
  // ALWAYS log the real error to Render logs
  console.error('ERROR:', error);

  const response =
    NODE_ENV === 'production'
      ? { error: { message: 'server error' } }
      : { message: error.message, error };

  res.status(500).json(response);
});



module.exports = app
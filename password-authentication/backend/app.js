import express, { json, urlencoded } from 'express'
import session from 'express-session'
import logger from 'morgan'

import router from './routes/index'

const app = express()

app.use(logger('dev'))
app.use(json())
app.use(urlencoded({ extended: false }))

// This is a simplistic session mechanism
// not designed to be used in production
app.use(
  session({
    secret: 'randomsecret!',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  }),
)

app.use('/', router)

export const handler = app

import express from 'express'
import session from 'express-session'

import { indexRouter } from './index.js'

const app = express()
app.use(express.json())

// This is a simplistic session mechanism, only to store access token and email between calls
// not designed to be used in production
app.use(
  session({
    secret: 'randomsecret!',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  }),
)

app.use('/', indexRouter)

export const handler = app

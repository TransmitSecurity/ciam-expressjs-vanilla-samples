import express from 'express'

import { mobileRouter } from './mobile.js'
import { desktopRouter } from './desktop.js'
import { indexRouter } from './index.js'

const app = express()
app.use(express.json())

app.use('/mobile', mobileRouter)
app.use('/desktop', desktopRouter)
app.use('/', indexRouter)

export const handler = app

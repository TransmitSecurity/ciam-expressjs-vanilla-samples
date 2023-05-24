import express from 'express';
import session from 'express-session';
import crypto from 'crypto';
import { indexRouter } from './routes/index.js';

const app = express();
app.use(express.json());
app.use(
  session({
    secret: crypto.randomUUID(),
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  }),
);
app.use('/', indexRouter);

export const handler = app;

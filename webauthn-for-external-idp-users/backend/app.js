import express from 'express';

import session from 'express-session';
import crypto from 'crypto';
import { indexRouter } from './routes';

const app = express();
app.use(express.json());

// This is a simplistic session mechanism
// not designed to be used in production
// This sample may be used with HTTP; in production code always use secure cooke, and add CSRF protection
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

import express, { json, urlencoded } from 'express';
import session from 'express-session';
import logger from 'morgan';
import crypto from 'crypto';

import { indexRouter } from './index.js';

const app = express();

app.use(logger('dev'));
app.use(json());
app.use(urlencoded({ extended: false }));

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

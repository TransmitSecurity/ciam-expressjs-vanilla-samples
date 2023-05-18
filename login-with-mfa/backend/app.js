import express, { json, urlencoded } from 'express';
import session from 'express-session';
import logger from 'morgan';
import crypto from 'crypto';

import router from './routes/index';
//todo: get rid of router stuff, have it all be in one file like magic link example

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

app.use('/', router);

export const handler = app;

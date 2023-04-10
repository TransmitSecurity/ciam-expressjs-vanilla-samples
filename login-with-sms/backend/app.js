import express, { json, urlencoded } from 'express';
import logger from 'morgan';

import { indexRouter } from './index.js';

const app = express();

app.use(logger('dev'));
app.use(json());
app.use(urlencoded({ extended: false }));

app.use('/', indexRouter);

export const handler = app;

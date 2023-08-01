import express from 'express';

import { indexRouter } from './index.js';

const app = express();
app.use(express.json());

app.use('/', indexRouter);

export const handler = app;

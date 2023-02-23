import express from 'express';

import {helloRouter} from "./hello.js";
import {todosRouter} from "./todos.js";

const app = express();

app.use('/api/hello', helloRouter);
app.use('/api/todos', todosRouter);

export const handler = app;
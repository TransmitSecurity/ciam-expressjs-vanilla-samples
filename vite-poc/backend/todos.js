import express from 'express';
import fetch from 'node-fetch';

const router = express.Router();

router.get("/", async function (req, res, next) {
  const todos = await fetch('https://jsonplaceholder.typicode.com/todos')
  const json = await todos.json();
  res.json({ todos: json });
  next();
});

export const todosRouter = router;

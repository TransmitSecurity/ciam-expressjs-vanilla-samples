import express from 'express';

const router = express.Router();

router.get("/", async function (req, res, next) {
  res.json({ hello: import.meta.env.VITE_TEST_VAR });
  next();
});

export const helloRouter = router;
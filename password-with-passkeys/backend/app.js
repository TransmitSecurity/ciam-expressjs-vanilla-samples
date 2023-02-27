import express from "express";
import { indexRouter } from "./index.js";
import { passkeyRouter } from "./passkey.js";

const app = express();
app.use(express.json());

app.use("/", indexRouter);
app.use("/passkey", passkeyRouter);

export const handler = app;

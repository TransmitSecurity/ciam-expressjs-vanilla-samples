import express  from "express";

import {mobileRouter} from "./routes/mobile.js";
import {desktopRouter} from "./routes/desktop.js";
import {indexRouter} from "./routes/index.js";

const app = express();
app.use(express.json())

app.use('/mobile', mobileRouter);
app.use('/desktop', desktopRouter);
app.use('/', indexRouter);

export const handler = app;

/*var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var indexRouter = require("./routes/index");
var c = require("./routes/mobile");
var desktopRouter = require("./routes/desktop");

var app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");

app.use("/", indexRouter);
app.use("/mobile", mobileRouter);
app.use("/desktop", desktopRouter);

var listener = app.listen(8080, function () {
  console.log("Listening on port " + listener.address().port);
});*/

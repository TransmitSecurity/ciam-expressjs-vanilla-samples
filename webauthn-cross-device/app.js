var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var indexRouter = require("./routes/index");
var mobileRouter = require("./routes/mobile");
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
});

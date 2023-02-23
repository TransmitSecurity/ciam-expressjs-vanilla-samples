import express from "express";
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.redirect("/pages/desktop.html");
});

export const indexRouter = router;

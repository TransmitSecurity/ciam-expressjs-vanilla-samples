var express = require("express");
var router = express.Router();

/* GET users listing. */
router.get("/", async function (req, res, next) {
  res.render("desktop", {
    clientId: process.env.TS_CLIENT_ID,
    appId: process.env.TS_APP_ID
  });
});

module.exports = router;

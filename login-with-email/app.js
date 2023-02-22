var express = require('express');
var path = require('path');

var indexRouter = require('./routes/index');

var app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

var listener = app.listen(8080, function () {
  console.log("Listening on port " + listener.address().port);
});


module.exports = app;

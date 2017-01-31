'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const livereload = require('connect-livereload');

const app = express();
app.use(express.static(__dirname + '/.build'));
app.use(bodyParser.urlencoded({
  extended: true
}));

if (process.env.NODE_ENV === 'development') {
  app.use(livereload({
    port: 35729
  }));
}

const listener = app.listen(process.env.PORT || 8000, () => {
  console.log(`Listening on port ${listener.address().port}`);
});
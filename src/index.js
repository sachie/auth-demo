'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const morgan = require('morgan');

const config = require('./configs/auth');
const auth = require('./auth/auth');

const app = express();
app.use(express.static(__dirname + '/.build'));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(morgan('dev'));

mongoose.connect(config.database);

auth.configure(app);

app.all('*', (req, res) => res.sendFile(__dirname + '/.build/index.html'));

const listener = app.listen(process.env.PORT || 8000, () => {
  console.log(`Listening on port ${listener.address().port}`);
});
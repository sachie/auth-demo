/**
 * Entry Point for the Node app.
 */

'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const morgan = require('morgan');

const config = require('./configs');
const loadUser = require('./middleware/loadUser');
const auth = require('./auth/auth');
const api = require('./api/');

const app = express();

app.use(express.static(__dirname + '/.build'));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use(morgan('dev'));

mongoose.connect(config.database);

loadUser.configure(app);
auth.configure(app);
api.configure(app);

app.all('*', (req, res) => res.sendFile(__dirname + '/.build/index.html'));

const listener = app.listen(process.env.PORT || 8000, () => {
  console.log(`Listening on port ${listener.address().port}`);
});
const express = require('express');
const { IEXCloudClient } = require('node-iex-cloud');
const fetch = require('node-fetch');
const path = require('path');
const session = require('express-session');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: 'nobodyknowsit',
    resave: true,
    saveUninitialized: true,
  })
);
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.listen(3000, () => {
  console.log('Server Started!');
});
module.exports = app;

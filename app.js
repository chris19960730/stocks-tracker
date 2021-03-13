const express = require('express');
const path = require('path');
const session = require('express-session');

const indexRouter = require('./routes/index');

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
// eslint-disable-next-line no-undef
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

// eslint-disable-next-line no-undef
app.listen(process.env.PORT || 3000, () => {
  console.log('Server Started!');
});
module.exports = app;

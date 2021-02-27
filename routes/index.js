const express = require('express');
const bcrypt = require('bcrypt');
const path = require('path');
const router = express.Router();
const { IEXCloudClient } = require('node-iex-cloud');
const fetch = require('node-fetch');

const stockTracker = require('../models/stockTrackerDB');

const iex = new IEXCloudClient(fetch, {
  sandbox: false,
  publishable: 'sk_15302993e1aa43c1b7e47474783d657d',
  version: 'stable',
});
let logo = '';
iex
  .symbol('snow')
  .logo()
  .then((res) => {
    logo = res.url;
  });
router.get('/test', function (req, res) {
  res.send(logo);
});

router.post('/register', async (req, res) => {
  const user = req.body;
  const hash = await bcrypt.hash(user.password, 10);
  const new_user = {
    ...user,
    password: hash,
  };
  const userId = await stockTracker.addUser(new_user);
  console.log(userId);
  req.session.user_id = userId;
  res.redirect('/watchlists');
});

router.get('/register', (req, res) => {
  res.redirect('/register.html');
});

router.get('/watchlists', (req, res) => {
  if (!req.session.user_id) {
    return res.redirect('/login');
  }
  res.redirect('/watchlists.html');
});

router.get('/login', (req, res) => {
  res.redirect('/login.html');
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await stockTracker.getUser(email);
    const match = await bcrypt.compare(password, user.password);
    if (match) {
      req.session.user_id = user._id;
      res.redirect('/watchlists');
    } else {
      res.redirect('/login.html');
    }
  } catch {
    res.redirect('/login.html');
  }
});

router.post('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login');
});

router.post('/123', function (req, res) {
  console.log(req.body);
  res.json(req.body);
  res.redirect('/');
});

module.exports = router;

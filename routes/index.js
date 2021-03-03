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

const requireLogin = (req, res, next) => {
  if (!req.session.user_id) {
    return res.redirect('/login');
  }
  next();
};

router.get('/', (req, res) => {
  res.redirect('/login');
});

router.post('/register', async (req, res) => {
  const user = req.body;
  const hash = await bcrypt.hash(user.password, 10);
  const new_user = {
    ...user,
    password: hash,
  };
  try {
    const userId = await stockTracker.addUser(new_user);
    // console.log(userId);
    req.session.user_id = userId;
    res.redirect('/watchlists');
  } catch (err) {
    console.log(err);
    throw 'Something went wrong';
  }
});

router.get('/register', (req, res) => {
  res.redirect('/register.html');
});

router.get('/watchlists', requireLogin, async (req, res) => {
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
  req.session.user_id = null;
  req.session.destroy();
  res.redirect('/login');
});

router.get('/stocks', requireLogin, async (req, res) => {
  const { ticker } = req.query;
  // console.log(ticker);
  // console.log(req.query);

  const stock = await iex.symbol(ticker);

  const logo = await stock.logo();
  const { high, low } = await stock.previous();
  const company = await stock.company();
  if (logo && high && low) {
    stockInfo = {
      ticker: ticker,
      logo: logo,
      high_price: high,
      low_price: low,
      companyName: company.companyName,
      website: company.website,
      CEO: company.CEO,
    };
    // console.log(stockInfo);
    res.send(stockInfo);
  } else {
    res.status('500').send({ err: 'Something went wrong' });
  }
});

router.post('/myStocks', requireLogin, async (req, res) => {
  // console.log(req.session.user_id);
  // console.log(req.body);
  const stock = req.body;
  try {
    await stockTracker.addStock(req.session.user_id, stock);
    res.send('added successfully');
  } catch (err) {
    res.send(err);
  }
});

router.get('/myStocks', requireLogin, async (req, res) => {
  console.log(req.session.user_id);
  try {
    const stocks = await stockTracker.getCurrentUserStocks(req.session.user_id);
    // console.log(stocks);
    res.json(stocks);
  } catch (err) {
    res.send(err);
  }
});

router.delete('/myStocks', requireLogin, async (req, res) => {
  // console.log(req.body);
  const { ticker } = req.body;
  try {
    const deletedStock = await stockTracker.removeStock(
      req.session.user_id,
      ticker
    );
    console.log(deletedStock);
    res.status(200).send('Deleted successfully');
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;

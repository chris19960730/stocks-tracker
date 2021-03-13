const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const dotenv = require('dotenv');
dotenv.config();
const { IEXCloudClient } = require('node-iex-cloud');
const fetch = require('node-fetch');
const stockTracker = require('../models/stockTrackerDB');

const iex = new IEXCloudClient(fetch, {
  sandbox: false,
  // eslint-disable-next-line no-undef
  publishable: process.env.IEX_KEY,
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
    req.session.user_id = userId;
    res.send({ status: true });
  } catch {
    res.send({
      status: false,
    });
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
      res.send({ status: true });
    } else {
      res.send({
        status: false,
      });
    }
  } catch {
    res.send({
      status: false,
    });
  }
});

router.post('/verify', async (req, res) => {
  const { email } = req.body;
  try {
    const user = await stockTracker.getUser(email);
    if (user) {
      res.send({ exist: true });
    } else {
      res.send({ exist: false });
    }
  } catch {
    res.send({ error: 'error' });
  }
});

router.post('/logout', (req, res) => {
  req.session.user_id = null;
  req.session.destroy();
  res.redirect('/login');
});

router.get('/stocks', requireLogin, async (req, res) => {
  const { ticker } = req.query;
  const stock = await iex.symbol(ticker);
  const logo = await stock.logo();
  const { high, low } = await stock.previous();
  const company = await stock.company();
  if (logo && high && low) {
    const stockInfo = {
      ticker: ticker,
      logo: logo,
      high_price: high,
      low_price: low,
      companyName: company.companyName,
      website: company.website,
      CEO: company.CEO,
    };
    res.send(stockInfo);
  } else {
    res.status('500').send({ err: 'Something went wrong' });
  }
});

router.post('/myStocks', requireLogin, async (req, res) => {
  const stock = req.body;
  try {
    await stockTracker.addStock(req.session.user_id, stock);
    res.send('added successfully');
  } catch (err) {
    res.send(err);
  }
});

router.get('/myStocks', requireLogin, async (req, res) => {
  try {
    const stocks = await stockTracker.getCurrentUserStocks(req.session.user_id);
    res.json(stocks);
  } catch (err) {
    res.send(err);
  }
});

router.delete('/myStocks', requireLogin, async (req, res) => {
  const { stock_id } = req.body;
  try {
    await stockTracker.removeStock(stock_id);
    res.status(200).send('Deleted successfully');
  } catch (err) {
    res.status(500).send(err);
  }
});

router.get('/myProfile', requireLogin, async (req, res) => {
  try {
    const user = await stockTracker.getUserById(req.session.user_id);
    res.json(user);
  } catch (err) {
    res.send(err);
  }
});

router.get('/userProfile', requireLogin, async (req, res) => {
  const { user_id } = req.query;
  try {
    const user = await stockTracker.getUserById(user_id);
    res.json(user);
  } catch (err) {
    res.send(err);
  }
});

router.get('/profile', requireLogin, async (req, res) => {
  res.redirect('/profile.html');
});

router.get('/update_profile', requireLogin, async (req, res) => {
  res.redirect('/update_profile.html');
});

router.post('/profile', requireLogin, async (req, res) => {
  const user = req.body;
  const hash = await bcrypt.hash(user.password, 10);
  const new_user = {
    ...user,
    password: hash,
  };
  try {
    await stockTracker.updateUser(new_user, req.session.user_id);
    res.send({ status: true });
  } catch (err) {
    res.send(err);
  }
});

router.get('/friends', requireLogin, async (req, res) => {
  const { queryRegex } = req.query;
  const current_user_id = req.session.user_id;

  try {
    const users = await stockTracker.getUserByRegex(
      queryRegex,
      current_user_id
    );
    res.send(users);
  } catch (err) {
    res.send(err);
  }
});

router.get('/friendStocks', requireLogin, async (req, res) => {
  const { user_id } = req.query;

  try {
    const stocks = await stockTracker.getCurrentUserStocks(user_id);
    res.send(stocks);
  } catch (err) {
    res.send(err);
  }
});

router.get('*', requireLogin, async (req, res) => {
  res.redirect('/watchlists');
});

module.exports = router;

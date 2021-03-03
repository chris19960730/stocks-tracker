const { MongoClient } = require('mongodb');

const url = process.env.MONGO_URL || 'mongodb://localhost:27017/';

module.exports = {
  addUser: async (user) => {
    console.log('database url is *************');
    console.log(url);
    const client = new MongoClient(url, { useUnifiedTopology: true });
    await client.connect();
    const db = client.db('stockTracker');
    const users = db.collection('user');
    try {
      const x = await users.insertOne({
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        password: user.password,
      });
      client.close();
      return x.insertedId;
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
  getUser: async (email) => {
    const client = new MongoClient(url, { useUnifiedTopology: true });
    await client.connect();
    const db = client.db('stockTracker');
    const users = db.collection('user');
    try {
      const userFound = await users.findOne({
        email: email,
      });
      client.close();
      return userFound;
    } catch (err) {
      throw err;
    }
  },

  addStock: async (user_id, stock) => {
    const client = new MongoClient(url, { useUnifiedTopology: true });
    await client.connect();
    const db = client.db('stockTracker');
    const stocks = db.collection('stocks');
    try {
      const x = await stocks.insertOne({
        user_id: user_id,
        ticker: stock.ticker,
        logo: stock.logo,
        high_price: stock.high_price,
        low_price: stock.low_price,
        companyName: stock.companyName,
        website: stock.website,
        CEO: stock.CEO,
      });
      client.close();
    } catch (err) {
      throw err;
    }
  },

  getCurrentUserStocks: async (user_id) => {
    const client = new MongoClient(url, { useUnifiedTopology: true });
    await client.connect();
    const db = client.db('stockTracker');
    const stocks = db.collection('stocks');
    try {
      const currentUserStocks = await stocks
        .find({
          user_id: user_id,
        })
        .toArray();

      client.close();
      return currentUserStocks;
    } catch (err) {
      throw err;
    }
  },
  removeStock: async (user_id, ticker) => {
    const client = new MongoClient(url, { useUnifiedTopology: true });
    await client.connect();
    const db = client.db('stockTracker');
    const stocks = db.collection('stocks');
    try {
      const x = await stocks.deleteOne({
        user_id: user_id,
        ticker: ticker,
      });

      client.close();
      return x;
    } catch (err) {
      throw err;
    }
  },
};

const { MongoClient, ObjectId } = require('mongodb');

const url = process.env.MONGO_URL || 'mongodb://localhost:27017/';

module.exports = {
  addUser: async (user) => {
    const client = new MongoClient(url, { useUnifiedTopology: true });
    try {
      await client.connect();
      const db = client.db('stockTracker');
      const users = db.collection('user');

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
    try {
      await client.connect();
      const db = client.db('stockTracker');
      const users = db.collection('user');
      const userFound = await users.findOne({
        email: email,
      });
      client.close();
      return userFound;
    } catch (err) {
      throw err;
    }
  },

  getUserById: async (user_id) => {
    const client = new MongoClient(url, { useUnifiedTopology: true });
    try {
      await client.connect();
      const db = client.db('stockTracker');
      const users = db.collection('user');
      const userFound = await users.findOne({
        _id: ObjectId(user_id),
      });
      client.close();
      return userFound;
    } catch (err) {
      throw err;
    }
  },

  updateUser: async (user, user_id) => {
    const client = new MongoClient(url, { useUnifiedTopology: true });
    try {
      await client.connect();
      const db = client.db('stockTracker');
      const users = db.collection('user');

      await users.updateOne(
        {
          _id: ObjectId(user_id),
        },
        {
          $set: {
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            password: user.password,
          },
        }
      );
      client.close();
    } catch (err) {
      console.log(err);
      throw err;
    }
  },

  addStock: async (user_id, stock) => {
    const client = new MongoClient(url, { useUnifiedTopology: true });
    try {
      await client.connect();
      const db = client.db('stockTracker');
      const stocks = db.collection('stocks');
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
    try {
      await client.connect();
      const db = client.db('stockTracker');
      const stocks = db.collection('stocks');
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

  removeStock: async (stock_id) => {
    const client = new MongoClient(url, { useUnifiedTopology: true });
    try {
      await client.connect();
      const db = client.db('stockTracker');
      const stocks = db.collection('stocks');
      const x = await stocks.deleteOne({
        _id: ObjectId(stock_id),
      });

      client.close();
      return x;
    } catch (err) {
      throw err;
    }
  },
  getUserByRegex: async (queryRegex, current_user_id) => {
    const client = new MongoClient(url, { useUnifiedTopology: true });
    try {
      await client.connect();
      const db = client.db('stockTracker');
      const users = db.collection('user');
      const result = await users
        .find({
          email: { $regex: queryRegex },
          _id: { $ne: ObjectId(current_user_id) },
        })
        .toArray();
      client.close();
      return result;
    } catch (err) {
      throw err;
    }
  },
};

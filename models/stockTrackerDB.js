const { MongoClient, ObjectId } = require('mongodb');

// eslint-disable-next-line no-undef
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
      return x.insertedId;
    } finally {
      client.close();
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
      return userFound;
    } finally {
      client.close();
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
      return userFound;
    } finally {
      client.close();
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
    } finally {
      client.close();
    }
  },

  addStock: async (user_id, stock) => {
    const client = new MongoClient(url, { useUnifiedTopology: true });
    try {
      await client.connect();
      const db = client.db('stockTracker');
      const stocks = db.collection('stocks');
      await stocks.insertOne({
        user_id: user_id,
        ticker: stock.ticker,
        logo: stock.logo,
        high_price: stock.high_price,
        low_price: stock.low_price,
        companyName: stock.companyName,
        website: stock.website,
        CEO: stock.CEO,
      });
    } finally {
      client.close();
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
      return currentUserStocks;
    } finally {
      client.close();
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
      return x;
    } finally {
      client.close();
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
      return result;
    } finally {
      client.close();
    }
  },
};

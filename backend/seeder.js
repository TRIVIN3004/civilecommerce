require('dotenv').config({ path: './.env' });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('./config/db');
const User = require('./models/User');
const Product = require('./models/Product');
const Dealer = require('./models/Dealer');
const Inventory = require('./models/Inventory');
const Order = require('./models/Order');
const products = require('./data/products');

const importData = async () => {
  try {
    await connectDB();

    // Clear DB
    await Order.deleteMany();
    await Inventory.deleteMany();
    await Product.deleteMany();
    await Dealer.deleteMany();
    await User.deleteMany();

    // 1. Create Users
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash('123456', salt);

    const usersToCreate = [
      { name: 'Admin User', email: 'admin@test.com', password, role: 'admin' },
      { name: 'John Customer', email: 'customer@test.com', password, role: 'customer' },
      { name: 'Ramesh Singh', email: 'dealer1@test.com', password, role: 'dealer' },
      { name: 'Suresh Patel', email: 'dealer2@test.com', password, role: 'dealer' }
    ];

    const createdUsers = await User.insertMany(usersToCreate);
    const dealer1User = createdUsers[2];
    const dealer2User = createdUsers[3];

    // 2. Create Global Products
    const createdProducts = await Product.insertMany(products);

    // 3. Create Dealers Profiles
    const dealers = await Dealer.insertMany([
      {
        user: dealer1User._id,
        storeName: 'Singh Construction Supply',
        contactPhone: '9876543210',
        address: '101 Industrial Estate, Nagpur',
        location: {
           type: 'Point',
           coordinates: [79.0882, 21.1458] // Nagpur approx
        },
        isVerified: true
      },
      {
        user: dealer2User._id,
        storeName: 'Patel Building Materials',
        contactPhone: '9123456780',
        address: 'Phase 2, Wardha Road, Wardha',
        location: {
           type: 'Point',
           coordinates: [78.6022, 20.7453] // Wardha approx
        },
        isVerified: true
      }
    ]);

    // 4. Create Inventory for Dealers
    await Inventory.insertMany([
       { dealer: dealers[0]._id, product: createdProducts[0]._id, price: 350, quantity: 500 }, // PPC
       { dealer: dealers[0]._id, product: createdProducts[1]._id, price: 380, quantity: 200 }, // Super
       { dealer: dealers[0]._id, product: createdProducts[2]._id, price: 8, quantity: 10000 }, // Bricks
       
       { dealer: dealers[1]._id, product: createdProducts[1]._id, price: 375, quantity: 300 }, // Super
       { dealer: dealers[1]._id, product: createdProducts[3]._id, price: 65000, quantity: 50 }, // Steel
       { dealer: dealers[1]._id, product: createdProducts[4]._id, price: 1200, quantity: 15 }, // Sand
    ]);

    console.log('Data Imported successfully! Test credentials generated.');
    process.exit();
  } catch (error) {
    console.error(`Error with seeding: ${error}`);
    process.exit(1);
  }
};

importData();

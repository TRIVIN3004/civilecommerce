require('dotenv').config({ path: './.env' });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('./config/db');
const User = require('./models/User');
const Product = require('./models/Product');
const Dealer = require('./models/Dealer');
const Inventory = require('./models/Inventory');
const Order = require('./models/Order');

const seedIndiaData = async () => {
  try {
    await connectDB();

    console.log('Seeding Pan-India construction material dealers...');

    // Clear DB to avoid duplicates if run multiple times
    await Order.deleteMany({});
    await Inventory.deleteMany({});
    await Product.deleteMany({});
    await Dealer.deleteMany({});
    await User.deleteMany({});

    // Hash a generic password for all dealers
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash('dealer123', salt);

    // 1. Create Dealer & Customer Users
    const usersToCreate = [
      // Test Customer so you can log in and place orders
      { name: 'Test Customer', email: 'customer@test.com', password, role: 'customer' },
      
      // Dealers
      { name: 'Ravi Kumar', email: 'ravi.chennai@test.com', password, role: 'dealer' },
      { name: 'Amit Shah Traders', email: 'amit.mumbai@test.com', password, role: 'dealer' },
      { name: 'Gupta Steels', email: 'gupta.delhi@test.com', password, role: 'dealer' },
      { name: 'Reddy Builders', email: 'reddy.hyderabad@test.com', password, role: 'dealer' },
      { name: 'Kolkata BuildMart', email: 'buildmart.kolkata@test.com', password, role: 'dealer' },
      { name: 'Gowda Materials', email: 'gowda.bangalore@test.com', password, role: 'dealer' },
      { name: 'Patel Cements', email: 'patel.ahmedabad@test.com', password, role: 'dealer' },
      { name: 'Deshmukh Supply', email: 'deshmukh.pune@test.com', password, role: 'dealer' }
    ];

    const createdUsers = await User.insertMany(usersToCreate);

    // Skip the first user (customer) when creating dealers
    const dealerUsers = createdUsers.slice(1);

    // 2. Create Global Products
    const productData = [
      { name: 'UltraTech Portland Cement', category: 'Cement', description: '50kg Bag, OPC 53 Grade', images: [] },
      { name: 'Ambuja Cement', category: 'Cement', description: '50kg Bag, PPC', images: [] },
      { name: 'ACC Concrete+', category: 'Cement', description: '50kg Premium Bag', images: [] },
      { name: 'Red Clay Bricks', category: 'Bricks', description: 'Standard size wire-cut bricks', images: [] },
      { name: 'Fly Ash Bricks', category: 'Bricks', description: 'Eco-friendly building bricks', images: [] },
      { name: 'Tata Tiscon TMT Steel Bar', category: 'Steel', description: '12mm TMT Bar (per ton)', images: [] },
      { name: 'JSW Neo Steel', category: 'Steel', description: '10mm TMT Bar (per ton)', images: [] },
      { name: 'M-Sand (Manufactured Sand)', category: 'Sand', description: 'Washed M-Sand for concrete (per truck)', images: [] },
      { name: 'River Sand', category: 'Sand', description: 'Fine river sand for plastering (per truck)', images: [] }
    ];

    const createdProducts = await Product.insertMany(productData);

    const [ultratech, ambuja, acc, redBricks, flyAsh, tataSteel, jswSteel, msand, riverSand] = createdProducts;

    // 3. Create Dealer Profiles with Pan-India Locations
    const dealersData = [
      {
        user: dealerUsers[0]._id, // Chennai
        storeName: 'Chennai South Construction Supply',
        contactPhone: '9840123456',
        address: '45 South Phase, Guindy Industrial Estate, Chennai, Tamil Nadu',
        location: { type: 'Point', coordinates: [80.2206, 13.0067] }, 
        isVerified: true
      },
      {
        user: dealerUsers[1]._id, // Mumbai
        storeName: 'Maharashtra Build Supply',
        contactPhone: '9820123456',
        address: '12 Andheri Kurla Road, Andheri East, Mumbai, Maharashtra',
        location: { type: 'Point', coordinates: [72.8777, 19.0760] },
        isVerified: true
      },
      {
        user: dealerUsers[2]._id, // Delhi
        storeName: 'Capital Steel & Cement',
        contactPhone: '9810123456',
        address: '34 Okhla Industrial Area Phase 1, New Delhi',
        location: { type: 'Point', coordinates: [77.2090, 28.6139] },
        isVerified: true
      },
      {
        user: dealerUsers[3]._id, // Hyderabad
        storeName: 'Deccan Hardware Materials',
        contactPhone: '9989123456',
        address: 'Madapur Main Road, HITEC City, Hyderabad, Telangana',
        location: { type: 'Point', coordinates: [78.3811, 17.4486] },
        isVerified: true
      },
      {
        user: dealerUsers[4]._id, // Kolkata
        storeName: 'Bengal Builders Depot',
        contactPhone: '9830123456',
        address: 'Sector V, Salt Lake City, Kolkata, West Bengal',
        location: { type: 'Point', coordinates: [88.3639, 22.5726] },
        isVerified: true
      },
      {
        user: dealerUsers[5]._id, // Bangalore
        storeName: 'Karnataka Tech Build',
        contactPhone: '9845123456',
        address: 'Peenya Industrial Area, Bengaluru, Karnataka',
        location: { type: 'Point', coordinates: [77.5946, 12.9716] },
        isVerified: true
      },
      {
        user: dealerUsers[6]._id, // Ahmedabad
        storeName: 'Gujarat Cement Distributors',
        contactPhone: '9898123456',
        address: 'Sarkhej-Gandhinagar Highway, Ahmedabad, Gujarat',
        location: { type: 'Point', coordinates: [72.5714, 23.0225] },
        isVerified: true
      },
      {
        user: dealerUsers[7]._id, // Pune
        storeName: 'Pune Iron & Steel Works',
        contactPhone: '9922123456',
        address: 'Hinjawadi Phase 2, Pune, Maharashtra',
        location: { type: 'Point', coordinates: [73.8567, 18.5204] },
        isVerified: true
      }
    ];

    const dealers = await Dealer.insertMany(dealersData);
    
    // 4. Create Inventory (Stock & Price variation based on region)
    const inventoryData = [
      // Chennai Dealer
      { dealer: dealers[0]._id, product: ultratech._id, price: 380, quantity: 500 },
      { dealer: dealers[0]._id, product: redBricks._id, price: 9.5, quantity: 20000 },
      { dealer: dealers[0]._id, product: msand._id, price: 12000, quantity: 15 },
      
      // Mumbai Dealer
      { dealer: dealers[1]._id, product: ambuja._id, price: 395, quantity: 800 },
      { dealer: dealers[1]._id, product: tataSteel._id, price: 70000, quantity: 40 },
      { dealer: dealers[1]._id, product: flyAsh._id, price: 7.5, quantity: 30000 },
      { dealer: dealers[1]._id, product: riverSand._id, price: 19000, quantity: 10 },
      
      // Delhi Dealer
      { dealer: dealers[2]._id, product: acc._id, price: 375, quantity: 1000 },
      { dealer: dealers[2]._id, product: jswSteel._id, price: 65500, quantity: 60 },
      { dealer: dealers[2]._id, product: redBricks._id, price: 8, quantity: 50000 },
      
      // Hyderabad Dealer
      { dealer: dealers[3]._id, product: ultratech._id, price: 385, quantity: 450 },
      { dealer: dealers[3]._id, product: tataSteel._id, price: 68500, quantity: 30 },
      { dealer: dealers[3]._id, product: msand._id, price: 11500, quantity: 25 },
      
      // Kolkata Dealer
      { dealer: dealers[4]._id, product: ambuja._id, price: 365, quantity: 600 },
      { dealer: dealers[4]._id, product: redBricks._id, price: 7, quantity: 40000 },
      { dealer: dealers[4]._id, product: riverSand._id, price: 16000, quantity: 20 },
      
      // Bangalore Dealer
      { dealer: dealers[5]._id, product: acc._id, price: 390, quantity: 700 },
      { dealer: dealers[5]._id, product: jswSteel._id, price: 67000, quantity: 45 },
      { dealer: dealers[5]._id, product: flyAsh._id, price: 8.5, quantity: 25000 },
      { dealer: dealers[5]._id, product: msand._id, price: 13000, quantity: 35 },
      
      // Ahmedabad Dealer
      { dealer: dealers[6]._id, product: ambuja._id, price: 360, quantity: 1200 },
      { dealer: dealers[6]._id, product: tataSteel._id, price: 64000, quantity: 80 },
      { dealer: dealers[6]._id, product: redBricks._id, price: 6.5, quantity: 80000 },
      
      // Pune Dealer
      { dealer: dealers[7]._id, product: ultratech._id, price: 385, quantity: 550 },
      { dealer: dealers[7]._id, product: jswSteel._id, price: 69000, quantity: 30 },
      { dealer: dealers[7]._id, product: riverSand._id, price: 18500, quantity: 15 }
    ];

    await Inventory.insertMany(inventoryData);

    console.log('Successfully seeded 8 dealers across India along with their inventory!');
    process.exit();
  } catch (error) {
    console.error('Seeding Error:', error);
    process.exit(1);
  }
};

seedIndiaData();

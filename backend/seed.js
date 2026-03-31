require('dotenv').config({ path: './.env' });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('./config/db');
const User = require('./models/User');
const Product = require('./models/Product');
const Dealer = require('./models/Dealer');
const Inventory = require('./models/Inventory');

const seedChennaiData = async () => {
  try {
    await connectDB();

    console.log('Seeding Chennai construction material dealers...');

    // Hash a generic password for all dealers
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash('dealer123', salt);

    // 1. Create Dealer Users
    const dealerUsersToCreate = [
      { name: 'Ravi Kumar', email: 'ravi.guindy@test.com', password, role: 'dealer' },
      { name: 'Karthik Cements', email: 'karthik.ambattur@test.com', password, role: 'dealer' },
      { name: 'Murugan Traders', email: 'murugan.tambaram@test.com', password, role: 'dealer' },
      { name: 'Balaji Steels', email: 'balaji.velachery@test.com', password, role: 'dealer' },
      { name: 'Chennai BuildMart', email: 'buildmart.omr@test.com', password, role: 'dealer' },
      { name: 'Sri Ram Materials', email: 'sriram.poonamalle@test.com', password, role: 'dealer' }
    ];

    const createdUsers = await User.insertMany(dealerUsersToCreate);

    // 2. Clear previous global products if necessary, or just insert new ones
    // For safety, let's assume we want to create specific products and query them later.
    const productData = [
      { name: 'UltraTech Portland Cement', category: 'Cement', description: '50kg Bag, OPC 53 Grade', images: [] },
      { name: 'Ramco Super Grade Cement', category: 'Cement', description: '50kg Bag, PPC', images: [] },
      { name: 'Red Clay Bricks', category: 'Bricks', description: 'Standard size wire-cut bricks', images: [] },
      { name: 'Tata Tiscon TMT Steel Bar', category: 'Steel', description: '12mm TMT Bar (per ton)', images: [] },
      { name: 'JSW Neo Steel', category: 'Steel', description: '10mm TMT Bar (per ton)', images: [] },
      { name: 'M-Sand (Manufactured Sand)', category: 'Sand', description: 'Washed M-Sand for concrete (per truck)', images: [] },
      { name: 'River Sand', category: 'Sand', description: 'Fine river sand for plastering (per truck)', images: [] }
    ];

    const createdProducts = await Product.insertMany(productData);

    const [ultratech, ramco, redBricks, tataSteel, jswSteel, msand, riverSand] = createdProducts;

    // 3. Create Dealer Profiles with Chennai Locations
    const dealersData = [
      {
        user: createdUsers[0]._id, // Ravi Kumar (Guindy)
        storeName: 'Ravi Construction Supply',
        contactPhone: '9840123456',
        address: '45 South Phase, Guindy Industrial Estate, Chennai',
        location: { type: 'Point', coordinates: [80.2206, 13.0067] }, // [lng, lat]
        isVerified: true
      },
      {
        user: createdUsers[1]._id, // Karthik Cements (Ambattur)
        storeName: 'Karthik Cements & Steels',
        contactPhone: '9043123456',
        address: '112 Ambattur Red Hills Rd, Ambattur, Chennai',
        location: { type: 'Point', coordinates: [80.1481, 13.1143] },
        isVerified: true
      },
      {
        user: createdUsers[2]._id, // Murugan (Tambaram)
        storeName: 'Murugan Traders',
        contactPhone: '9444123456',
        address: '7 GST Road, Tambaram Sanatorium, Chennai',
        location: { type: 'Point', coordinates: [80.1275, 12.9229] },
        isVerified: true
      },
      {
        user: createdUsers[3]._id, // Balaji (Velachery)
        storeName: 'Balaji Hardwares & Steels',
        contactPhone: '9940123456',
        address: '22 Velachery Main Road, Chennai',
        location: { type: 'Point', coordinates: [80.2219, 12.9716] },
        isVerified: true
      },
      {
        user: createdUsers[4]._id, // Chennai BuildMart (OMR)
        storeName: 'Chennai BuildMart',
        contactPhone: '9884123456',
        address: 'Rajiv Gandhi Salai, OMR, Perungudi, Chennai',
        location: { type: 'Point', coordinates: [80.2335, 12.9150] },
        isVerified: true
      },
      {
        user: createdUsers[5]._id, // Sri Ram (Poonamallee)
        storeName: 'Sri Ram Building Materials',
        contactPhone: '9380123456',
        address: '14 Trunk Road, Poonamallee, Chennai',
        location: { type: 'Point', coordinates: [80.0945, 13.0473] },
        isVerified: true
      }
    ];

    const dealers = await Dealer.insertMany(dealersData);
    
    // 4. Create Inventory (Stock & Price variation)
    const inventoryData = [
      // Guindy Dealer
      { dealer: dealers[0]._id, product: ultratech._id, price: 380, quantity: 500 },
      { dealer: dealers[0]._id, product: redBricks._id, price: 9.5, quantity: 20000 },
      { dealer: dealers[0]._id, product: tataSteel._id, price: 68000, quantity: 25 }, // Tons
      
      // Ambattur Dealer
      { dealer: dealers[1]._id, product: ramco._id, price: 365, quantity: 800 },
      { dealer: dealers[1]._id, product: jswSteel._id, price: 65000, quantity: 40 },
      { dealer: dealers[1]._id, product: msand._id, price: 12000, quantity: 15 }, // Load/Truck
      
      // Tambaram Dealer
      { dealer: dealers[2]._id, product: ultratech._id, price: 390, quantity: 300 },
      { dealer: dealers[2]._id, product: ramco._id, price: 375, quantity: 400 },
      { dealer: dealers[2]._id, product: riverSand._id, price: 18000, quantity: 10 },
      
      // Velachery Dealer
      { dealer: dealers[3]._id, product: redBricks._id, price: 10, quantity: 15000 },
      { dealer: dealers[3]._id, product: tataSteel._id, price: 68500, quantity: 30 },
      
      // OMR Dealer
      { dealer: dealers[4]._id, product: ultratech._id, price: 400, quantity: 1000 },
      { dealer: dealers[4]._id, product: jswSteel._id, price: 66000, quantity: 60 },
      { dealer: dealers[4]._id, product: msand._id, price: 12500, quantity: 25 },
      
      // Poonamallee Dealer
      { dealer: dealers[5]._id, product: ramco._id, price: 360, quantity: 600 },
      { dealer: dealers[5]._id, product: redBricks._id, price: 8.5, quantity: 50000 },
      { dealer: dealers[5]._id, product: riverSand._id, price: 17500, quantity: 20 }
    ];

    await Inventory.insertMany(inventoryData);

    console.log('Successfully seeded 6 dealers in Chennai along with their inventory!');
    process.exit();
  } catch (error) {
    console.error('Seeding Error:', error);
    process.exit(1);
  }
};

seedChennaiData();

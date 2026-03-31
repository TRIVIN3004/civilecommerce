const User = require('../models/User');
const Dealer = require('../models/Dealer');
const bcrypt = require('bcryptjs');
const generateToken = require('../utils/generateToken');

// @desc    Register a new user
// @route   POST /api/auth/register
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, dealerDetails } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || 'customer',
    });

    if (user) {
      // If role is dealer, create dealer profile
      if (user.role === 'dealer' && dealerDetails) {
        const { storeName, contactPhone, address, longitude, latitude } = dealerDetails;
        await Dealer.create({
          user: user._id,
          storeName,
          contactPhone,
          address,
          location: {
            type: 'Point',
            coordinates: [longitude, latitude] // Ensure GeoJSON format
          }
        });
      }

      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id, user.role),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      let dealerProfile = null;
      if (user.role === 'dealer' || user.role === 'admin') { // some admins might also be mapped here but typically mainly dealers.
         dealerProfile = await Dealer.findOne({ user: user._id });
      }

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        dealerId: dealerProfile ? dealerProfile._id : null,
        token: generateToken(user._id, user.role),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user profile (for validation/session recovery)
// @route   GET /api/auth/profile
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (user) {
      let dealerProfile = null;
      if (user.role === 'dealer') {
        dealerProfile = await Dealer.findOne({ user: user._id });
      }
      res.json({
        ...user.toJSON(),
        dealerId: dealerProfile ? dealerProfile._id : null
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { registerUser, loginUser, getUserProfile };

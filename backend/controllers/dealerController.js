const Dealer = require('../models/Dealer');
const Inventory = require('../models/Inventory');

// @desc    Get nearby dealers
// @route   GET /api/dealers/nearby
const getNearbyDealers = async (req, res) => {
  try {
    const { lat, lng, radius = 20 } = req.query; // radius in km (default 20km)
    
    if (!lat || !lng) {
      return res.status(400).json({ message: 'Latitude and Longitude are required' });
    }

    const nearbyDealers = await Dealer.find({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: parseInt(radius) * 1000 // Convert km to meters
        }
      }
    }).populate('user', 'name email');

    res.json(nearbyDealers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get dealer profile by ID
// @route   GET /api/dealers/:id
const getDealerById = async (req, res) => {
    try {
        const dealer = await Dealer.findById(req.params.id).populate('user', 'name email');
        if(dealer) {
            res.json(dealer);
        } else {
            res.status(404).json({ message: 'Dealer not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// @desc    Get dealers with specific product in stock nearby
// @route   GET /api/dealers/product/:productId/nearby
const getNearbyDealersWithProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const { lat, lng, radius = 20 } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({ message: 'Latitude and Longitude are required' });
    }

    // Step 1: Find all nearby dealers
    const nearbyDealers = await Dealer.find({
      location: {
        $near: {
           $geometry: { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] },
           $maxDistance: parseInt(radius) * 1000
        }
      }
    });

    const dealerIds = nearbyDealers.map(d => d._id);

    // Step 2: Find inventories for this product among those dealers that have quantity > 0
    const inventories = await Inventory.find({
      product: productId,
      dealer: { $in: dealerIds },
      quantity: { $gt: 0 }
    }).populate('dealer').populate('product');

    // Map to include distance - slightly simplified: front-end will display distance via leaflet
    res.json(inventories);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports = { getNearbyDealers, getDealerById, getNearbyDealersWithProduct };

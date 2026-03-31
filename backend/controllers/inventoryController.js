const Inventory = require('../models/Inventory');
const Dealer = require('../models/Dealer');

// @desc    Get inventory for logged in dealer
// @route   GET /api/inventory/my
// @access  Private/Dealer
const getMyInventory = async (req, res) => {
  try {
    const dealer = await Dealer.findOne({ user: req.user._id });
    if (!dealer) {
      return res.status(404).json({ message: 'Dealer profile not found' });
    }

    const inventory = await Inventory.find({ dealer: dealer._id }).populate('product');
    res.json(inventory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add or update inventory item
// @route   POST /api/inventory
// @access  Private/Dealer
const updateInventory = async (req, res) => {
  try {
    const { productId, price, quantity } = req.body;

    const dealer = await Dealer.findOne({ user: req.user._id });
    if (!dealer) {
      return res.status(404).json({ message: 'Dealer profile not found' });
    }

    let inventory = await Inventory.findOne({ dealer: dealer._id, product: productId });

    if (inventory) {
      // Update existing
      inventory.price = price || inventory.price;
      inventory.quantity = quantity !== undefined ? quantity : inventory.quantity;
      await inventory.save();
    } else {
      // Create new
      inventory = await Inventory.create({
        dealer: dealer._id,
        product: productId,
        price,
        quantity
      });
    }

    // Emit socket event for real-time update
    req.io.emit('stock_updated', { dealerId: dealer._id, productId, price: inventory.price, quantity: inventory.quantity });

    res.status(200).json(inventory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getMyInventory, updateInventory };

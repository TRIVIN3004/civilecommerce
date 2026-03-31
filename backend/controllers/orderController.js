const Order = require('../models/Order');
const Inventory = require('../models/Inventory');
const Dealer = require('../models/Dealer');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = async (req, res) => {
  try {
    const { orderItems, dealerId, totalAmount } = req.body;

    if (orderItems && orderItems.length === 0) {
      res.status(400).json({ message: 'No order items' });
      return;
    } else {
      // Verify inventory quantities and update them
      for (const item of orderItems) {
        const inventory = await Inventory.findOne({ _id: item.inventory, dealer: dealerId });
        if (!inventory || inventory.quantity < item.quantity) {
             return res.status(400).json({ message: 'Insufficient stock for one or more items' });
        }
      }

      // Create Order
      const order = new Order({
        customer: req.user._id,
        dealer: dealerId,
        items: orderItems,
        totalAmount,
      });

      const createdOrder = await order.save();

      // Deduct stock from Inventory
      for (const item of orderItems) {
        const inventory = await Inventory.findOne({ _id: item.inventory });
        inventory.quantity -= item.quantity;
        await inventory.save();

        // Emit real-time updates for each item decremented
        req.io.emit('stock_updated', { dealerId, productId: inventory.product, price: inventory.price, quantity: inventory.quantity });
      }

      // Notify dealer visually about the new order via websocket
      req.io.emit(`new_order_${dealerId}`, createdOrder);

      res.status(201).json(createdOrder);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('customer', 'name email')
      .populate('dealer', 'storeName contactPhone');

    if (order) {
      res.json(order);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ customer: req.user._id }).populate('dealer');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get dealer orders
// @route   GET /api/orders/dealer
// @access  Private/Dealer
const getDealerOrders = async (req, res) => {
    try {
        const dealer = await Dealer.findOne({ user: req.user._id });
        if (!dealer) {
            return res.status(404).json({ message: 'Dealer profile not found' });
        }
  
        const orders = await Order.find({ dealer: dealer._id }).populate('customer', 'name email phone').populate('items.inventory');
        res.json(orders);
    } catch (error) {
         res.status(500).json({ message: error.message });
    }
}

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Dealer
const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findById(req.params.id);

        if(order) {
            order.status = status;
            const updatedOrder = await order.save();
            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch(error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = { addOrderItems, getOrderById, getMyOrders, getDealerOrders, updateOrderStatus };

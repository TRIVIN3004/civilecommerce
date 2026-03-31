const express = require('express');
const router = express.Router();
const { addOrderItems, getOrderById, getMyOrders, getDealerOrders, updateOrderStatus } = require('../controllers/orderController');
const { protect, dealer } = require('../middlewares/authMiddleware');

router.route('/').post(protect, addOrderItems);
router.route('/myorders').get(protect, getMyOrders);
router.route('/dealer').get(protect, dealer, getDealerOrders);
router.route('/:id').get(protect, getOrderById);
router.route('/:id/status').put(protect, dealer, updateOrderStatus);

module.exports = router;

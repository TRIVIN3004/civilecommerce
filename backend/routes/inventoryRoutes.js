const express = require('express');
const router = express.Router();
const { getMyInventory, updateInventory } = require('../controllers/inventoryController');
const { protect, dealer } = require('../middlewares/authMiddleware');

router.route('/').post(protect, dealer, updateInventory);
router.route('/my').get(protect, dealer, getMyInventory);

module.exports = router;

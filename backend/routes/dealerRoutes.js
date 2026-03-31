const express = require('express');
const router = express.Router();
const { getNearbyDealers, getDealerById, getNearbyDealersWithProduct } = require('../controllers/dealerController');

router.get('/nearby', getNearbyDealers);
router.get('/product/:productId/nearby', getNearbyDealersWithProduct);
router.get('/:id', getDealerById);

module.exports = router;

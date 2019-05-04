const express = require('express');
const router = express.Router();

const auth = require('../middleware/check_auth');

const orderController = require('../controller/ordersController');

router.get('/',auth, orderController.getAllOrders);

router.post('/', auth, orderController.postNewOrders);

router.get('/:orderID', auth, orderController.getOrdersById);

router.post('/deleteOrder', auth, orderController.deleteOrders);

module.exports = router;
const express = require('express');
const router = express.Router();

const auth = require('../middleware/check_auth');

const productController = require('../controller/productController');

router.get('/', auth,productController.getAllProducts);

router.post('/', auth, productController.postNewProduct);

router.get('/:productID', auth, productController.getProductById);

router.delete('/:productID', auth, productController.deleteProducts);

router.post('/ubahData', auth, productController.updateProduct);

module.exports = router;
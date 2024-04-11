const express = require('express');
const productosController = require('../controllers/productosController');
const router = express.Router();

router.post('/sincronizar', productosController.sincronizarProducto);

module.exports = router;

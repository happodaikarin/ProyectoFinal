const express = require('express');
const interaccionesController = require('../controllers/interaccionesController');
const router = express.Router();

router.post('/', interaccionesController.crearInteraccion);

module.exports = router;

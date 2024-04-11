// usuariosRoutes.js

const express = require('express');
const router = express.Router();

const { sincronizarUsuario } = require('../controllers/usuariosController');

// Define el endpoint para sincronizar usuarios
router.post('/sincronizar', sincronizarUsuario);

module.exports = router;



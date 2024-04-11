// src/config/database.js
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('interactions_bd', 'happosai', 'perr1toPari$', {
  host: 'localhost',
  dialect: 'mysql'
});

module.exports = sequelize;

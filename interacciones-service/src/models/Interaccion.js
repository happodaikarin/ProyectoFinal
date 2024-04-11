const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Usuario = require('./Usuario');
const Producto = require('./Producto');

const Interaccion = sequelize.define('Interaccion', {
  id_interaccion: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_usuario: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: Usuario,
      key: 'id_usuario'
    }
  },
  id_producto: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: Producto,
      key: 'id_producto'
    }
  },
  tipo: {
    type: DataTypes.STRING,
    allowNull: true
  },
  timestamp: {
    type: DataTypes.DATE, // Cambiado de TIMESTAMP a DATE
    allowNull: true
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, {
  // Otras opciones del modelo si son necesarias
});

module.exports = Interaccion;

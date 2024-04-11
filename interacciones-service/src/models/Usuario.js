  const { DataTypes } = require('sequelize');
  const sequelize = require('../config/database');

  const Usuario = sequelize.define('Usuario', {
    id_usuario: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nickname: DataTypes.TEXT
  }, {
    tableName: 'usuarios',
    timestamps: false
  });

  module.exports = Usuario;

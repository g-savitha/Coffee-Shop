const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Staff = sequelize.define('Staff', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  // RBAC attributes
  role: {
    type: DataTypes.STRING,
    allowNull: false
    // barista, shift_manager, owner, store_manager
  },
  // ABAC atttributes
  shift: {
    type: DataTypes.STRING,
    // mornign, afternoon, evening

  },
  hireDate: {
    type: DataTypes.DATE
  },
  trainingLevel: {
    type: DataTypes.INTEGER
    // om a scale of 1-5
  },
  storeLocation: {
    type: DataTypes.STRING,
    // bengaluru, mall, airport
  }
}, {
  tableName: 'staff',
  timestamps: true
})

module.exports = Staff;
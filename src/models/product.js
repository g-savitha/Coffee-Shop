const { DataTypes } = require("sequelize");
const { sequelize } = require('../config/database')

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  category: {
    type: DataTypes.STRING,
    // coffee, tea, croissant, pastry, merchandise

  },
  availability: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  // for ABAC: who can modify this product
  specialityItem: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  limitedTimeOffer: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  createdBy: {
    type: DataTypes.INTEGER,
    // References Staff id
  }
},
  {
    tableName: 'products',
    schema: 'coffee_shop_schema',
    timestamps: true
  })

module.exports = Product;
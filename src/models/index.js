const Staff = require('./staff')
const Product = require('./product')

const { sequelize } = require('../config/database')

// Define relationships
Product.belongsTo(Staff, { foreignKey: 'createdBy', as: 'creator' });

module.exports = {
  Staff,
  Product,
  sequelize
}
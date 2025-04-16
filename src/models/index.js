const Staff = require('./staff')
const Product = require('./product')
const Inventory = require('./inventory')
const StoreSettings = require('./storeSettings')

const { sequelize } = require('../config/database')

// Define relationships
Product.belongsTo(Staff, { foreignKey: 'createdBy', as: 'creator' });
Inventory.belongsTo(Staff, { foreignKey: 'lastUpdatedBy', as: 'updater' });
StoreSettings.belongsTo(Staff, { foreignKey: 'lastUpdatedBy', as: 'updater' });

module.exports = {
  Staff,
  Product,
  Inventory,
  StoreSettings,
  sequelize
}
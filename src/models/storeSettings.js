const { DataTypes } = require("sequelize");
const { sequelize } = require('../config/database');

const StoreSettings = sequelize.define('StoreSettings', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  },
  storeName: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'Coffee Shop'
  },
  storeAddress: {
    type: DataTypes.STRING,
    allowNull: true
  },
  contactEmail: {
    type: DataTypes.STRING,
    allowNull: true
  },
  contactPhone: {
    type: DataTypes.STRING,
    allowNull: true
  },
  openingHours: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {
      monday: { open: '08:00', close: '20:00', isClosed: false },
      tuesday: { open: '08:00', close: '20:00', isClosed: false },
      wednesday: { open: '08:00', close: '20:00', isClosed: false },
      thursday: { open: '08:00', close: '20:00', isClosed: false },
      friday: { open: '08:00', close: '20:00', isClosed: false },
      saturday: { open: '09:00', close: '18:00', isClosed: false },
      sunday: { open: '10:00', close: '16:00', isClosed: true }
    }
  },
  taxRate: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
    defaultValue: 18.00
  },
  currency: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'INR'
  },
  receiptFooter: {
    type: DataTypes.TEXT,
    allowNull: true,
    defaultValue: 'Thank you for visiting our coffee shop!'
  },
  logoUrl: {
    type: DataTypes.STRING,
    allowNull: true
  },
  enableLoyaltyProgram: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  pointsPerPurchase: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 10
  },
  pointsRedemptionThreshold: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 100
  },
  discountPercentage: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 10
  },
  lastUpdatedBy: {
    type: DataTypes.INTEGER,
    // References Staff id
  }
},
{
  tableName: 'store_settings',
  schema: 'coffee_shop_schema',
  timestamps: true
});

module.exports = StoreSettings; 
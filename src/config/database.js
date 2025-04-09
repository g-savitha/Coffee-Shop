const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

const { DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT } = process.env

const sequelize = new Sequelize(
  DB_NAME,
  DB_USER,
  DB_PASSWORD, {
  host: DB_HOST,
  port: DB_PORT,
  dialect: 'postgres',
  logging: false,
  schema: 'coffee_shop_schema'
}
)

const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('☕️ Connected to the coffee shop database!');
  }
  catch (err) {
    console.error('❌ Database connection failed:', error);
  }
}

module.exports = {
  sequelize,
  testConnection
}
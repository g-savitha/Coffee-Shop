const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

const { DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_SCHEMA } = process.env

const sequelize = new Sequelize(
  DB_NAME,
  DB_USER,
  DB_PASSWORD, {
  host: DB_HOST,
  port: DB_PORT,
  dialect: 'postgres',
  logging: false,
  schema: DB_SCHEMA,
}
)

const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('☕️ Connected to the coffee shop database!');
  }
  catch (err) {
    console.error('❌ Database connection failed:', err);
  }
}

module.exports = {
  sequelize,
  testConnection
}
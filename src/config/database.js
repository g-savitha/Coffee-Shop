const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

const isRailway = process.env.RAILWAY_STATIC_URL !== undefined;

const SCHEMA_NAME = 'coffee_shop_schema'

const { DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT } = process.env

let sequelize;

if (isRailway) {
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
    schema: SCHEMA_NAME,
    logging: false,
  });
}

else {
  sequelize = new Sequelize(
    DB_NAME,
    DB_USER,
    DB_PASSWORD, {
    host: DB_HOST,
    port: DB_PORT,
    dialect: 'postgres',
    logging: false,
    schema: SCHEMA_NAME,
  }
  )
}

const ensureSchema = async () => {
  try {
    // Create schema if it doesn't exist
    await sequelize.query(`CREATE SCHEMA IF NOT EXISTS ${SCHEMA_NAME};`);

    console.log(`✅ Schema '${SCHEMA_NAME}' is ready`);
  } catch (error) {
    console.error(`❌ Error creating schema:`, error);
  }
};

const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('☕️ Connected to the coffee shop database!');

    // ensure schema exists
    await ensureSchema();
  }
  catch (err) {
    console.error('❌ Database connection failed:', err);
  }
}

module.exports = {
  sequelize,
  testConnection
}
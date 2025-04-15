const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env file in the root directory
dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });

const isRailway = process.env.RAILWAY === 'true' ||
  process.env.RAILWAY_SERVICE_ID !== undefined;

const SCHEMA_NAME = process.env.DB_SCHEMA || 'coffee_shop_schema';

// Set default values if environment variables are not set
const DB_NAME = process.env.DB_NAME || 'coffee_shop';
const DB_USER = process.env.DB_USER || 'barista_app';
const DB_PASSWORD = process.env.DB_PASSWORD || 'barista';
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = process.env.DB_PORT || 5432;

// Log database connection parameters for debugging
console.log('Database connection parameters:');
console.log(`  Database: ${DB_NAME}`);
console.log(`  User: ${DB_USER}`);
console.log(`  Host: ${DB_HOST}`);
console.log(`  Port: ${DB_PORT}`);
console.log(`  Schema: ${SCHEMA_NAME}`);

let sequelize;

if (isRailway) {
  console.log('Configuring for Railway deployment');

  // Get the DATABASE_URL from Railway
  const databaseUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;

  if (!databaseUrl) {
    console.error('DATABASE_URL environment variable not set!');
  }

  sequelize = new Sequelize(databaseUrl, {
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
    console.error('Error details:', err.message);
    
    if (isRailway) {
      console.error('Make sure you have provisioned a PostgreSQL database in your Railway project');
    } else {
      console.error(`Make sure the database "${DB_NAME}" exists and user "${DB_USER}" has access to it.`);
      console.error('You can create them with these PostgreSQL commands:');
      console.error(`  CREATE USER ${DB_USER} WITH PASSWORD '${DB_PASSWORD}';`);
      console.error(`  CREATE DATABASE ${DB_NAME} OWNER ${DB_USER};`);
    }
  }
}

module.exports = {
  sequelize,
  testConnection
}
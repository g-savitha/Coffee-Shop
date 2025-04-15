const express = require('express');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const cors = require('cors');
const path = require('path');

const { testConnection, sequelize } = require('./config/database');
const { Staff, Product } = require('./models');

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
console.log(`Configured to use port: ${PORT}`);
const isProduction = process.env.NODE_ENV === 'production';

// middleware
app.use(express.json());
app.use(cors({
  origin: isProduction
    ? '*' // Allow all origins in production (you can restrict this if needed)
    : 'http://localhost:3000'
}));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

// Health check endpoint for Railway
app.get('/health', (req, res) => {
  res.status(200).send('ok');
});

// API root
app.get('/api', (req, res) => {
  res.json({ message: '☕ Welcome to Coffee Shop Management API!' });
});

// Serve static frontend assets in production
if (isProduction) {
  const frontendPath = path.join(__dirname, '../../../packages/frontend/dist');
  
  // Serve static files
  app.use(express.static(frontendPath));
  
  // Specific routes for SPA navigation
  app.get('/', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
  });
  
  // For any frontend routes, fallback to index.html
  app.use((req, res, next) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.join(frontendPath, 'index.html'));
    } else {
      next();
    }
  });
}

// Initialise Database
const initaliseServer = async () => {
  try {
    console.log('Starting server initialization...');
    console.log('Environment:', process.env.NODE_ENV);
    console.log('Running on Railway:', Boolean(process.env.RAILWAY_SERVICE_ID));
    console.log('Database URL exists:', Boolean(process.env.DATABASE_URL));
    
    // Test database connection first
    await testConnection();
    
    // sync models with database
    console.log('Syncing database models...');
    await sequelize.sync({ force: true });
    console.log('☕ Database tables created');

    // create initial Data
    console.log('Creating initial data...');
    await createInitialData();
    
    // Only start the server if database initialization was successful
    app.listen(PORT, () => {
      console.log(`☕ Coffee Shop server brewing on port ${PORT}`);
    });
  }
  catch (error) {
    console.error('❌ Failed to initialise the server', error);
    if (error.parent && error.parent.code) {
      console.error(`Error code: ${error.parent.code}`);
    }
    // Don't exit in development to allow for troubleshooting
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
};

const createInitialData = async () => {
  try {
    // Check if we already have staff members
    const staffCount = await Staff.count();
    if (staffCount > 0) {
      console.log(`Found ${staffCount} existing staff members, skipping data creation`);
      return;
    }

    const staffMembers = [
      {
        username: 'owner',
        password: await bcrypt.hash('owner123', 10),
        role: 'owner',
        shift: 'morning',
        hireDate: new Date('2019-01-01'),
        trainingLevel: 5,
        storeLocation: 'bengaluru'
      },
      {
        username: 'manager',
        password: await bcrypt.hash('manager123', 10),
        role: 'store_manager',
        shift: 'morning',
        hireDate: new Date('2020-03-15'),
        trainingLevel: 4,
        storeLocation: 'bengaluru'
      },
      {
        username: 'shift_lead',
        password: await bcrypt.hash('shift123', 10),
        role: 'shift_manager',
        shift: 'evening',
        hireDate: new Date('2021-06-10'),
        trainingLevel: 3,
        storeLocation: 'mall'
      },
      {
        username: 'barista',
        password: await bcrypt.hash('barista123', 10),
        role: 'barista',
        shift: 'afternoon',
        hireDate: new Date('2022-11-05'),
        trainingLevel: 2,
        storeLocation: 'mall'
      }
    ];

    await Staff.bulkCreate(staffMembers);
    console.log('☕ Staff members created');

    // Create initial products
    const products = [
      {
        name: 'Espresso',
        price: 199,
        category: 'coffee',
        availability: true,
        specialtyItem: false,
        limitedTimeOffer: false,
        createdBy: 1 // owner
      },
      {
        name: 'Seasonal Pumpkin Latte',
        price: 275,
        category: 'coffee',
        availability: true,
        specialtyItem: true,
        limitedTimeOffer: true,
        createdBy: 2 // manager
      },
      {
        name: 'House Blend',
        price: 225,
        category: 'coffee',
        availability: false,
        specialtyItem: false,
        limitedTimeOffer: false,
        createdBy: 3 // shift manager
      },
      {
        name: 'Blueberry Muffin',
        price: 190,
        category: 'pastry',
        availability: true,
        specialtyItem: false,
        limitedTimeOffer: false,
        createdBy: 2 // manager
      },
      {
        name: 'Logo Coffee Mug',
        price: 299,
        category: 'merchandise',
        availability: false,
        specialtyItem: false,
        limitedTimeOffer: false,
        createdBy: 1 // owner
      }
    ];

    await Product.bulkCreate(products);
    console.log('☕ Products created');
  }
  catch (error) {
    console.error('Error creating initial data:', error);
  }
};

initaliseServer();
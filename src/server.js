const express = require('express');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const cors = require('cors');
const path = require('path');

const { testConnection, sequelize } = require('./config/database');
const { Staff, Product, Inventory, StoreSettings } = require('./models');

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const staffRoutes = require('./routes/staff');
const inventoryRoutes = require('./routes/inventory');
const settingsRoutes = require('./routes/settings');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
console.log(`Configured to use port: ${PORT}`);
const isProduction = process.env.NODE_ENV === 'production';

// middleware
app.use(express.json());
app.use(cors({
  origin: true, // Allow requests from any origin
  credentials: true // Allow cookies and credentials
}));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/settings', settingsRoutes);

// Health check endpoint for Railway
app.get('/health', (req, res) => {
  console.log('Health check requested');
  // Return database status in health check
  const dbStatus = sequelize.authenticate()
    .then(() => 'connected')
    .catch(err => `error: ${err.message}`);
  
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    database: dbStatus,
    environment: process.env.NODE_ENV || 'development'
  });
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
    const forceSync = process.env.NODE_ENV !== 'production';
    console.log(`Using force sync: ${forceSync}`);
    await sequelize.sync({ force: forceSync });
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
        name: 'Coffee Shop Tumbler',
        price: 450,
        category: 'merchandise',
        availability: true,
        specialtyItem: false,
        limitedTimeOffer: false,
        createdBy: 1 // owner
      }
    ];

    await Product.bulkCreate(products);
    console.log('☕ Products created');

    // Create initial inventory items
    const inventoryItems = [
      {
        name: 'Arabica Coffee Beans',
        category: 'Coffee Beans',
        quantity: 25,
        unit: 'kg',
        unitPrice: 850,
        supplier: 'Premium Coffee Suppliers',
        reorderLevel: 5,
        notes: 'Premium quality Arabica beans',
        lastUpdatedBy: 1 // owner
      },
      {
        name: 'Whole Milk',
        category: 'Milk',
        quantity: 50,
        unit: 'L',
        unitPrice: 65,
        supplier: 'Local Dairy Farm',
        reorderLevel: 10,
        expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        notes: 'Fresh whole milk',
        lastUpdatedBy: 2 // manager
      },
      {
        name: 'Vanilla Syrup',
        category: 'Syrups',
        quantity: 8,
        unit: 'L',
        unitPrice: 320,
        supplier: 'Flavor Creations',
        reorderLevel: 2,
        notes: 'Popular flavor for lattes',
        lastUpdatedBy: 2 // manager
      },
      {
        name: 'Paper Cups 12oz',
        category: 'Cups',
        quantity: 1000,
        unit: 'units',
        unitPrice: 3.5,
        supplier: 'EcoCup Distributors',
        reorderLevel: 200,
        notes: 'Environmentally friendly cups',
        lastUpdatedBy: 1 // owner
      },
      {
        name: 'Cleaning Solution',
        category: 'Cleaning Supplies',
        quantity: 5,
        unit: 'L',
        unitPrice: 250,
        supplier: 'Clean Solutions Inc',
        reorderLevel: 1,
        notes: 'For daily cleaning of equipment',
        lastUpdatedBy: 3 // shift manager
      }
    ];

    await Inventory.bulkCreate(inventoryItems);
    console.log('☕ Inventory items created');

    // Create default store settings
    await StoreSettings.create({
      storeName: 'Bangalore Coffee Shop',
      storeAddress: '123 Coffee Street, Bangalore, India',
      contactEmail: 'info@coffeeshop.com',
      contactPhone: '+91 9876543210',
      lastUpdatedBy: 1 // owner
    });
    console.log('☕ Default store settings created');

  } catch (error) {
    console.error('Failed to create initial data:', error);
  }
};

initaliseServer();
const express = require('express');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const { testConnection, sequelize } = require('./config/database');
const { Staff, Product } = require('./models');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// middleware
app.use(express.json())

app.get('/', (req, res) => {
  res.send({ message: '☕ Welcome to Coffee Shop Management API!' })
})

// Initialise Database
const initaliseServer = async () => {
  try {
    await testConnection();
    // sync models with database
    await sequelize.sync({ force: true });
    console.log('☕ Database tables created');

    // create initial Data

    await createInitialData();
    app.listen(PORT, () => {
      console.log(`☕ Coffee Shop server brewing on port ${PORT}`);
    });
  }
  catch (error) {
    console.log('❌ Failed to initialise the server', error)
  }
}

const createInitialData = async () => {
  try {
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
    console.log('☕ Products created')
  }
  catch (error) {
    console.error('Error creating initial data:', error);
  }
}

initaliseServer();
const express = require('express');
const { Product } = require('../models');
const { authenticate } = require('../middleware/auth');
const { checkRole } = require('../middleware/rbac');
const { checkAttributes, policies } = require('../middleware/abac');

const router = express.Router();

// get all products (accessible to all authenticated staff)
router.get('/', authenticate, async (req, res) => {
  try {
    const products = await Product.findAll();
    res.json(products);
  }
  catch (error) {
    res.status(500).json({ message: 'Error fetching products', error: error.message });
  }
});

// get a single product
router.get('/:id', authenticate, async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  }
  catch (error) {
    res.status(500).json({ message: 'Error fetching product', error: error.message });
  }
});

// Create a product: RBAC (Only managers and creators)
router.post('/', authenticate, checkRole('manage_products'), async (req, res) => {
  try {
    const { name, price, category, specialtyItem, limitedTimeOffer } = req.body;

    const product = await Product.create({
      name,
      price,
      category,
      specialtyItem: specialtyItem || false,
      limitedTimeOffer: limitedTimeOffer || false,
      availability: true,
      createdBy: req.staff.id
    });

    res.status(201).json(product);
  }
  catch (error) {
    res.status(500).json({ message: 'Error creating product', error: error.message });
  }
});

// Update Product (ABAC: combination of policies)
router.put('/:id', authenticate, checkAttributes((staff, resource, action, env) => {
  // combine multiple policies
  const hasPermissionByRole = ['owner', 'store_manager', 'shift_manager'].includes(staff.role);
  const hasTrainingRequired = policies.hasTrainingForSpecialtyItems(staff, resource);
  const isWorkingShift = policies.canModifyDuringShift(staff, resource, action, env);

  const isCreator = staff.id === resource.createdBy;

  // For specialty items: need higher role OR training + creator status
  if (resource.specialtyItem) {
    return (staff.role === 'owner' || staff.role === 'store_manager') || (hasTrainingRequired && isCreator && isWorkingShift);
  }

  // for limited time offers need to be a creator or manager
  if (resource.limitedTimeOffer) {
    return policies.isCreatorOrManager(staff, resource) && isWorkingShift;
  }

  // Regular products: need appropriate role and be on shift
  return hasPermissionByRole && isWorkingShift;
}),
  async (req, res) => {
    try {
      const product = await Product.findByPk(req.params.id);

      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }

      const { name, price, category, availability } = req.body;

      // Update product
      await product.update({
        name: name || product.name,
        price: price || product.price,
        category: category || product.category,
        availability: availability !== undefined ? availability : product.availability
      });

      res.json(product);
    }
    catch (error) {
      res.status(500).json({ message: 'Error updating product', error: error.message });
    }
  });

// Update product details only (not price) - For shift managers
router.patch('/:id/details', authenticate, checkRole('update_products'), async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const { name, category, specialtyItem, limitedTimeOffer } = req.body;
    
    // Allow updating details but not price (shift managers)
    const updates = {};
    if (name) updates.name = name;
    if (category) updates.category = category;
    if (specialtyItem !== undefined) updates.specialtyItem = specialtyItem;
    if (limitedTimeOffer !== undefined) updates.limitedTimeOffer = limitedTimeOffer;

    // Update product details
    await product.update(updates);

    res.json(product);
  }
  catch (error) {
    res.status(500).json({ message: 'Error updating product details', error: error.message });
  }
});

// Update availability only (RBAC: all staff can do this)
router.patch('/:id/availability', authenticate, checkRole('update_availability'), async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const { availability } = req.body;

    if (availability === undefined) {
      return res.status(400).json({ message: 'Availability is required' });
    }

    // Update availability only
    await product.update({ availability });

    res.json(product);
  }
  catch (error) {
    res.status(500).json({ message: 'Error updating availability', error: error.message });
  }
});

// Update product price (only owner & store manager)
router.patch('/:id/price', authenticate, checkRole('manage_prices'), async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const { price } = req.body;

    if (price === undefined) {
      return res.status(400).json({ message: 'Price is required' });
    }

    // Update price only
    await product.update({ price });

    res.json(product);
  }
  catch (error) {
    res.status(500).json({ message: 'Error updating product price', error: error.message });
  }
});

// Delete product (RBAC: only owners can delete)
router.delete('/:id', authenticate, checkRole('manage_products'), async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    await product.destroy();
    res.json({ message: 'Product deleted successfully' });
  }
  catch (error) {
    res.status(500).json({ message: 'Error deleting product', error: error.message });
  }
});

module.exports = router;
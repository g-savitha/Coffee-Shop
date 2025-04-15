const { Product } = require('../models')

const checkAttributes = (policyFunction) => {
  return async (req, res, next) => {
    try {
      // extract data needed for policy evaluation
      const staffAttributes = {
        role: req.staff.role,
        shift: req.staff.shift,
        trainingLevel: req.staff.trainingLevel,
        hireDate: req.staff.hireDate,
        storeLocation: req.staff.storeLocation,
        id: req.staff.id
      }

      // get resource attributes
      let resourceAttributes = {};
      if (req.params.id) {
        // If we're dealing with a product
        if (req.baseUrl.includes('/products')) {
          const product = await Product.findByPk(req.params.id);
          if (product) {
            resourceAttributes = {
              category: product.category,
              specialtyItem: product.specialtyItem,
              limitedTimeOffer: product.limitedTimeOffer,
              createdBy: product.createdBy
            };
          }
        }
      }
      // action attributes
      const actionAttributes = {
        method: req.method, //GET, POST, PUT, DELETE
        time: new Date(),
        path: req.path
      }

      // environment attributes
      const envAttributes = {
        currentHour: new Date().getHours(),
        isWeekend: [0, 6].includes(new Date().getDay()) // 0 is Sunday, 6 is Saturday
      };
      // Evaluate policy
      const allowed = policyFunction(
        staffAttributes,
        resourceAttributes,
        actionAttributes,
        envAttributes
      );

      if (allowed) {
        next();
      } else {
        res.status(403).json({
          message: 'Access denied based on attribute policies'
        });
      }
    }
    catch (error) {
      res.status(500).json({ message: 'Error checking attributes', error: error.message });
    }
  }
}

// Some example policy functions
const isCreatorOrManager = (staff, resource) => {
  return staff.id === resource.createdBy ||
    ['owner', 'store_manager'].includes(staff.role);
};

const hasTrainingForSpecialtyItems = (staff, resource) => {
  if (!resource.specialtyItem) return true;
  return staff.trainingLevel >= 3;
};

const canModifyDuringShift = (staff, resource, action, env) => {
  // Morning shift: 6-12, Afternoon: 12-18, Evening: 18-24
  const hour = env.currentHour;

  if (staff.shift === 'morning' && (hour >= 6 && hour < 12)) return true;
  if (staff.shift === 'afternoon' && (hour >= 12 && hour < 18)) return true;
  if (staff.shift === 'evening' && (hour >= 18 || hour < 6)) return true;

  // Owners and store managers can operate outside shifts
  return ['owner', 'store_manager'].includes(staff.role);
};


module.exports = {
  checkAttributes,
  policies: {
    isCreatorOrManager,
    hasTrainingForSpecialtyItems,
    canModifyDuringShift
  }
}
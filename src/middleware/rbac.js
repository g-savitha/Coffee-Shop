// role hirearchy and permissions
const roleHirearchy = {
  'owner': ['manage_staff', 'manage_products', 'manage_prices', 'update_availability', 'update_products'],
  'store_manager': ['manage_products', 'manage_prices', 'update_availability', 'update_products'],
  'shift_manager': ['update_products', 'update_availability'],
  'barista': ['update_availability']
};

// rbac middleware

const checkRole = (requiredPermission) => {
  return (req, res, next) => {
    const staffRole = req.staff.role;

    // Owner has all permissions
    if (staffRole === 'owner') {
      return next();
    }

    const permissions = roleHirearchy[staffRole] || [];

    if (permissions.includes(requiredPermission)) {
      next();
    }
    else {
      res.status(403).json({
        message: `Access denied. Your role (${staffRole}) doesn't have permission: ${requiredPermission}`
      })
    }
  }
}

module.exports = { checkRole };
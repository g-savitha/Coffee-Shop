// role hirearchy and permissions
const roleHirearchy = {
  'owner': ['manage_staff', 'manage_products', 'manage_prices', 'view_reports', 'manage_store', 'update_availability'],
  'store_manager': ['manage_products', 'manage_prices', 'view_reports', 'manage_schedule', 'update_availability'],
  'shift_manager': ['update_products', 'view_reports', 'manage_shift', 'update_availability'],
  'barista': ['view_products', 'update_availability']
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
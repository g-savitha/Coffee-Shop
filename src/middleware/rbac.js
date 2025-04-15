// role hirearchy and permissions
const roleHirearchy = {
  'owner': ['manage_staff', 'manage_products', 'manage_prices', 'view_reports', 'manage_store'],
  'store_manager': ['manage_products', 'manage_prices', 'view_reports', 'manage_schedule'],
  'shift_manager': ['update_products', 'view_reports', 'manage_shift'],
  'barista': ['view_products', 'update_availability']
};

// rbac middleware

const checkRole = (requiredPermission) => {
  return (req, res, next) => {
    const staffRole = req.staff.role;

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
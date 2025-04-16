// role hirearchy and permissions
const roleHirearchy = {
  'owner': ['manage_staff', 'manage_products', 'manage_prices', 'view_reports', 'manage_store', 'update_availability', 'update_products'],
  'store_manager': ['manage_products', 'manage_prices', 'view_reports', 'manage_schedule', 'update_availability', 'update_products'],
  'shift_manager': ['update_products', 'view_reports', 'manage_shift', 'update_availability'],
  'barista': ['view_products', 'update_availability']
};

// rbac middleware

// Function to check if user has a specific permission
const checkPermission = (requiredPermission) => {
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
      });
    }
  };
};

// Function to check if user has one of the allowed roles
const checkRole = (allowedRoles) => {
  return (req, res, next) => {
    const staffRole = req.staff.role;
    
    // If allowedRoles is an array, check if user's role is in the array
    if (Array.isArray(allowedRoles)) {
      if (allowedRoles.includes(staffRole)) {
        return next();
      }
    } 
    // If allowedRoles is a string (single role), check if it matches
    else if (staffRole === allowedRoles) {
      return next();
    }
    
    // If no match, deny access
    res.status(403).json({
      message: `Access denied. Your role (${staffRole}) is not authorized for this action.`
    });
  };
};

module.exports = { checkRole, checkPermission };
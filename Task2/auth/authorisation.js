const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
}

function customerOnly(req, res, next) {
  if (req.user.role !== "Customer") {
    return res.status(403).json({
      message: "Customer access only",
    });
  }

  next();
}

function kitchenStaffOnly(req, res, next) {
  if (req.user.role !== "KitchenStaff") {
    return res.status(403).json({
      message: "Kitchen Staff access only",
    });
  }

  next();
}

function waiterOnly(req, res, next) {
  if (req.user.role !== "Waiter") {
    return res.status(403).json({
      message: "Waiter access only",
    });
  }

  next();
}

function inventoryManagerOnly(req, res, next) {
  if (req.user.role !== "InventoryManager") {
    return res.status(403).json({
      message: "Inventory Manager access only",
    });
  }

  next();
}

function generalManagerOrAdminOnly(req, res, next) {
  if (req.user.role !== "GeneralManager" && req.user.role !== "Admin") {
    return res.status(403).json({
      message: "General Manager Or Admin access only",
    });
  }

  next();
}

function inventoryManagerGeneralManagerAdmin(req, res, next) {
  if (
    req.user.role !== "InventoryManager" &&
    req.user.role !== "GeneralManager" &&
    req.user.role !== "Admin"
  ) {
    return res.status(403).json({
      message: "Access denied",
    });
  }

  next();
}

function WaiterGeneralManagerAdmin(req, res, next) {
  if (
    req.user.role !== "Waiter" &&
    req.user.role !== "GeneralManager" &&
    req.user.role !== "Admin"
  ) {
    return res.status(403).json({
      message: "Access denied",
    });
  }

  next();
}

function customerWaiterGeneralManagerAdmin(req, res, next) {
  if (
    req.user.role !== "GeneralManager" &&
    req.user.role !== "Admin" &&
    req.user.role !== "Customer" &&
    req.user.role !== "Waiter"
  ) {
    return res.status(403).json({
      message: "Access denied",
    });
  }

  next();
}

function WaiterKitchenStaffGeneralManagerAdmin(req, res, next) {
  if (
    req.user.role !== "GeneralManager" &&
    req.user.role !== "Admin" &&
    req.user.role !== "Waiter" &&
    req.user.role !== "KitchenStaff"
  ) {
    return res.status(403).json({
      message: "Access denied",
    });
  }

  next();
}

function adminOnly(req, res, next) {
  if (req.user.role !== "Admin") {
    return res.status(403).json({
      message: "Admin access only",
    });
  }

  next();
}

module.exports = {
  authMiddleware,
  generalManagerOrAdminOnly,
  inventoryManagerOnly,
  waiterOnly,
  kitchenStaffOnly,
  adminOnly,
  customerWaiterGeneralManagerAdmin,
  customerOnly,
  WaiterGeneralManagerAdmin,
  inventoryManagerGeneralManagerAdmin,
  WaiterKitchenStaffGeneralManagerAdmin,
};

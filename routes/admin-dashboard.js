const express = require("express");
const router = express.Router();
const { validateUpdateUser } = require("../models/users");
const AUTH = require("../middleware/Auth");
const Admin = require("../middleware/Admin");
const { dashboardOverview } = require("../controllers/admin-dashboard");
const {
  getOrderHistory,
  adminGetAllOrders,
  getOrder,
} = require("../controllers/order");

// DASHBOARD OVERVIEW
router.get("/stats", AUTH, Admin, dashboardOverview);

// ORDER MANAGEMENT

module.exports = router;

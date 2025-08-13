const express = require("express");
const router = express.Router();
const AUTH = require("../middleware/Auth");
const {
  checkout,
  getOrder,
  getOrderHistory,
  adminGetAllOrders,
} = require("../controllers/order");
const Admin = require("../middleware/Admin");

// Checkout route
router.post("/checkout", AUTH, checkout);
router.get("/my/:id", AUTH, getOrder);
router.get("/myHistory", AUTH, getOrderHistory);

// ADMIN
router.get("/admin", AUTH, Admin, adminGetAllOrders);
router.get("/admin/:id", AUTH, Admin, getOrder);
router.get("/history/admin/:id", AUTH, Admin, getOrderHistory);

module.exports = router;

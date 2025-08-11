const express = require("express");
const router = express.Router();
const AUTH = require("../middleware/Auth");
const { checkout } = require("../controllers/order");

// Checkout route
router.post("/checkout", AUTH, checkout);

module.exports = router;

const express = require("express");
const router = express.Router();
const AUTH = require("../middleware/Auth");
const { checkout, getOrder } = require("../controllers/order");

// Checkout route
router.post("/checkout", AUTH, checkout);
router.get("/:id", AUTH, getOrder);

module.exports = router;

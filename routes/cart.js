const express = require("express");
const router = express.Router();
const { Products } = require("../models/Products");
const AUTH = require("../middleware/Auth");
const Admin = require("../middleware/Admin");
const validate = require("../middleware/Validate");
const { mongoose } = require("mongoose");
const { Cart, validateCart } = require("../models/cart");
const { createCart, getCart, clearCart, addItem, updateItem, removeItem } = require("../controllers/cart");

// create cart
router.post("/", AUTH, validate(validateCart), createCart);

// get cart
router.get("/", AUTH, getCart);

// clear chart
router.delete("/", AUTH, clearCart);

// add item
router.post("/item", AUTH, validate(validateCart),addItem);

// update item
router.patch("/item/:productId", AUTH,updateItem);

// remove item
router.delete("/item/:productId", AUTH,removeItem);


module.exports = router;

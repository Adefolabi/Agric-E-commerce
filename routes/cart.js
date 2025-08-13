const express = require("express");
const router = express.Router();
const AUTH = require("../middleware/Auth");
const validate = require("../middleware/Validate");
const {  validateCart } = require("../models/cart");
const { createCart, getCart, clearCart, addItem, updateItem, removeItem, viewAllCart } = require("../controllers/cart");
const Admin = require("../middleware/Admin");

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


// ADMIN
// view all cart 
router.get("/admin/allcart",AUTH,Admin, viewAllCart)


module.exports = router;

const express = require("express");
const router = express.Router();
const AUTH = require("../middleware/Auth");
const Admin = require("../middleware/Admin");
const {
  validateProduct,
  validateUpdateProduct,
} = require("../models/Products");
const validate = require("../middleware/Validate");
const {
  createProduct,
  getProduct,
  searchProduct,
  getsingleProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/product");
// create product
router.post("/", AUTH, Admin, validate(validateProduct), createProduct);

// get all product
router.get("/", AUTH, getProduct);

// search product
router.get("/search", searchProduct);

// get single product
router.get("/:id", AUTH, getsingleProduct);

// update

router.put("/:id", AUTH, Admin, validate(validateUpdateProduct), updateProduct);

// delete product
router.delete("/:id", AUTH, Admin, deleteProduct);

module.exports = router;

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
  updateProduct,
  deleteProduct,
  getSingleProduct,
  createFarmerProduct,
  getFarmerProduct,
  updateFarmerProduct,
  deleteFarmerProduct,
} = require("../controllers/product");
const Farmer = require("../middleware/farmer");
// // create product
// router.post("/", AUTH, Admin, validate(validateProduct), createProduct);

// get all product
router.get("/", AUTH, getProduct);

// search product
router.get("/search", searchProduct);

// get single product
router.get("/:id", AUTH, getSingleProduct);

// update

router.put("/:id", AUTH, Admin, validate(validateUpdateProduct), updateProduct);

// delete product
router.delete("/:id", AUTH, Admin, deleteProduct);

// Farmer routes
// create product
router.post(
  "/farmer",
  AUTH,
  Farmer,
  validate(validateProduct),
  createFarmerProduct
);
// delete product
router.delete("/farmer/:id", AUTH, Admin, deleteFarmerProduct);

// get own product
router.get("/farmer", AUTH, Farmer, getFarmerProduct);

// // search product
// router.get("/farmer/search", searchProduct);

// // get single product
// router.get("/farmer/:id", AUTH, getSingleProduct);

// update

router.put(
  "/farmer/:id",
  AUTH,
  Admin,
  validate(validateUpdateProduct),
  updateFarmerProduct
);
// ADMIN
// update
router.put(
  "/admin/:id",
  AUTH,
  Admin,
  validate(validateUpdateProduct),
  updateProduct
); // create product
router.post("/admin", AUTH, Admin, validate(validateProduct), createProduct);
// delete product
router.delete("/product/:id", AUTH, Admin, deleteProduct);

module.exports = router;

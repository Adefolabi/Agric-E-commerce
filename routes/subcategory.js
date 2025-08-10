const express = require("express");
const router = express.Router();
const AUTH = require("../middleware/Auth");
const Admin = require("../middleware/Admin");
const validate = require("../middleware/Validate");
const {
  Subcategory,
  validateSubcategory,
  validateUpdateSubcategory,
} = require("../models/Subcategories");
const {
  createSubcategory,
  getSubcategory,
  getSingleSubcategory,
  updateSubcategory,
  deleteSingleSubcategory,
} = require("../controllers/subcategory");

// create subcategories
router.post("/", AUTH, Admin, validate(validateSubcategory), createSubcategory);

// get all subcategories
router.get("/", AUTH, getSubcategory);

// get single subcategories
router.get("/:id", AUTH, getSingleSubcategory);

// update
router.put(
  "/:id",
  AUTH,
  Admin,
  validate(validateUpdateSubcategory),
  updateSubcategory
);

// delete subcategories
router.delete("/:id", AUTH, Admin, deleteSingleSubcategory);

module.exports = router;

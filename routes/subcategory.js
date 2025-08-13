const express = require("express");
const router = express.Router();
const AUTH = require("../middleware/Auth");
const {
  getSubcategory,
  getSingleSubcategory,
  createSubcategory,
  updateSubcategory,
  deleteSingleSubcategory,
} = require("../controllers/subcategory");
const Admin = require("../middleware/Admin");
const {
  validateSubcategory,
  validateUpdateSubcategory,
} = require("../models/Subcategories");
const validate = require("../middleware/Validate");

// get single subcategories
router.get("/:id", AUTH, getSingleSubcategory);
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

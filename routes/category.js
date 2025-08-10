const express = require("express");
const router = express.Router();
const AUTH = require("../middleware/Auth");
const Admin = require("../middleware/Admin");
const {
  Category,
  validateCategory,
  validateUpdateCategory,
} = require("../models/categories");
const validate = require("../middleware/Validate");
const {
  createCategory,
  getAllCategory,
  getSingleCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/category");

// create categories
router.post("/", AUTH, Admin, validate(validateCategory), createCategory);

// get all categories
router.get("/", AUTH, getAllCategory);

// get single categories
router.get("/:id", AUTH, getSingleCategory);

// update

router.put(
  "/:id",
  AUTH,
  Admin,
  validate(validateUpdateCategory),
  updateCategory
);

// delete categories
router.delete("/:id", AUTH, Admin, deleteCategory);

module.exports = router;

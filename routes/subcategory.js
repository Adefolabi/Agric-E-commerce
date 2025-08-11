const express = require("express");
const router = express.Router();
const AUTH = require("../middleware/Auth");
const {
  getSubcategory,
  getSingleSubcategory,
} = require("../controllers/subcategory");

// get all subcategories
router.get("/", AUTH, getSubcategory);

// get single subcategories
router.get("/:id", AUTH, getSingleSubcategory);

module.exports = router;

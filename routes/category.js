const express = require("express");
const router = express.Router();
const AUTH = require("../middleware/Auth");
const Admin = require("../middleware/Admin");
const Category = require("../models/categories");

// create categories
router.post("/", AUTH, Admin, async (req, res) => {
  try {
    let category = new Category({
      name: req.body.name,
      slug: req.body.slug,
      description: req.body.description,
    });
    category = await category.save();
    res.status(200).json(category);
  } catch (error) {
    if (error.code === 11000) {
      console.log("duplicate category");
      res.status(400).json({ error: "category already exists" });
    } else {
      console.error(error);
      res.status(500).json({ error: "Server error" });
    }
  }
});

// get all categories
router.get("/", AUTH, async (req, res) => {
  const categories = await Category.find();
  if (!categories.length)
    return res.json({ message: "No categories currently" }).status(200);
  res.status(200).json({ categories });
});

// get single categories
router.get("/:id", AUTH, async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).send("Invalid product ID format");
  }
  const category = await Category.findById(req.params._id);
  if (!category) return res.send("no category with that id ").status(404);
  res.status(200).send(category);
});

// update

router.put("/:id", AUTH, Admin, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).send("Invalid product ID format");
    }
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        slug: req.body.slug,
        description: req.body.description,
      },
      { new: true }
    );
    res.status(200).json({ category });
  } catch (error) {
    res.status(500).json({ error: "Failed to update User" });
  }
});

// delete categories
router.delete("/:id", AUTH, Admin, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).send("Invalid product ID format");
    }
    const deletedcategory = await deletedCategory.findByIdAndDelete(
      req.params.id
    );
    if (!deletedcategory)
      return res.status(404).json({ error: "SubCategory not found" });
    res.status(200).json({ message: "categories  deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete category " });
  }
});

module.exports = router;

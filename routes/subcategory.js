const express = require("express");
const router = express.Router();
const AUTH = require("../middleware/Auth");
const Admin = require("../middleware/Admin");
const SubCategory = require("../models/Subcategories");

// create subcategories
router.post("/", AUTH, Admin, async (req, res) => {
  try {
    let subCategory = new SubCategory({
      name: req.body.name,
      slug: req.body.slug,
      category: req.body.category,
    });
    subCategory = await subCategory.save();
    res.json(subCategory).status(200);
  } catch (error) {
    if (error.code === 11000) {
      console.log("duplicate subCategory");
      res.status(400).json({ error: "subCategory already exists" });
    } else {
      console.error(error);
      res.status(500).json({ error: "Server error" });
    }
  }
});

// get all subcategories
router.get("/", AUTH, async (req, res) => {
  const subcategories = await SubCategory.find();
  if (!subcategories.length)
    return res.json({ message: "No subcategories currently" }).status(200);
  res.json({ subcategories }).status(200);
});

// get single subcategories
router.get("/:id", AUTH, async (req, res) => {
  const subCategory = await SubCategory.findOne({ id: req.params._id });
  if (!subCategory) return res.send("no subCategory with that id ").status(404);
  res.send(subCategory).status(200);
});

// update

router.put("/:id", AUTH, Admin, async (req, res) => {
  try {
    const subcategories = await SubCategory.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        slug: req.body.slug,
        category: req.body.category,
      },
      { new: true }
    );
    res.json({ subcategories }).status(200);
  } catch (error) {
    res.status(500).json({ error: "Failed to update User" });
  }
});

// delete subcategories
router.delete("/:id", AUTH, Admin, async (req, res) => {
  try {
    await SubCategory.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "subcategories  deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete subCategory " });
  }
});

module.exports = router;

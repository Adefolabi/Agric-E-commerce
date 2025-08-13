const mongoose = require("mongoose");
const { Category } = require("../models/categories");

const createCategory = async (req, res) => {
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
};
const getAllCategory = async (req, res) => {
  const categories = await Category.find();
  if (!categories.length)
    return res.json({ message: "No categories currently" }).status(200);
  res.status(200).json({ categories });
};
const getSingleCategory = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).send("Invalid product ID format");
  }
  const category = await Category.findById(req.params.id);
  if (!category) return res.send("no category with that id ").status(404);
  res.status(200).send(category);
};
const updateCategory = async (req, res) => {
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
};
const deleteCategory = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).send("Invalid product ID format");
    }
    const deletedcategory = await Category.findByIdAndDelete(req.params.id);
    if (!deletedcategory)
      return res.status(404).json({ error: "SubCategory not found" });
    res.status(200).json({ message: "categories  deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete category " });
  }
};

module.exports = {
  createCategory,
  getAllCategory,
  getSingleCategory,
  updateCategory,
  deleteCategory,
};

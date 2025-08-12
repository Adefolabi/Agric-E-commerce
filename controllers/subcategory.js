const mongoose = require("mongoose");
const { Subcategory } = require("../models/Subcategories");

const createSubcategory = async (req, res) => {
  try {
    let subCategory = new Subcategory({
      name: req.body.name,
      slug: req.body.slug,
      category: req.body.category,
    });
    subCategory = await subCategory.save();
    res.status(201).json(subCategory);
  } catch (error) {
    if (error.code === 11000) {
      console.log("duplicate subCategory");
      res.status(400).json({ error: "subCategory already exists" });
    } else {
      console.error(error);
      res.status(500).json({ error: "Server error" });
    }
  }
};

const getSubcategory = async (req, res) => {
  const subcategories = await Subcategory.find().select("-createdAt -updatedAt -__v").populate("category","name");
  if (!subcategories.length)
    return res.json({ message: "No subcategories currently" }).status(200);
  res.status(200).json({ subcategories });
};

const getSingleSubcategory = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).send("Invalid product ID format");
  }
  const subCategory = await Subcategory.findById(req.params.id);
  if (!subCategory) return res.send("no subCategory with that id ").status(404);
  res.status(200).send(subCategory);
};

const updateSubcategory = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).send("Invalid product ID format");
    }
    const subcategory = await Subcategory.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        slug: req.body.slug,
        category: req.body.category,
      },
      { new: true }
    );
    res.status(200).json({ subcategory });
  } catch (error) {
    res.status(500).json({ error: "Failed to update User" });
  }
};

const deleteSingleSubcategory = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).send("Invalid product ID format");
    }
    const deletedSubCategory = await Subcategory.findByIdAndDelete(
      req.params.id
    );

    if (!deletedSubCategory) {
      return res.status(404).json({ error: "SubCategory not found" });
    }

    res.status(200).json({ message: "SubCategory deleted successfully" });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ error: "Failed to delete SubCategory" });
  }
};

module.exports = {
  createSubcategory,
  getSubcategory,
  getSingleSubcategory,
  updateSubcategory,
  deleteSingleSubcategory,
};

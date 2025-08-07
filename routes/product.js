const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const AUTH = require("../middleware/Auth");
const Admin = require("../middleware/Admin");
const Products = require("../models/Products");

// create product
router.post("/", AUTH, Admin, async (req, res) => {
  try {
    let product = new Products({
      name: req.body.name,
      category: req.body.category,
      subcategory: req.body.subcategory,
      price: req.body.price,
      inventory: req.body.inventory,
      description: req.body.description,
    });
    product = await product.save();
    res.json(product).status(200);
  } catch (error) {
    if (error.code === 11000) {
      console.log("duplicate product");
      res.status(400).json({ error: "product already exists" });
    } else {
      console.error(error);
      res.status(500).json({ error: "Server error" });
    }
  }
});

// get all product
router.get("/", AUTH, async (req, res) => {
  const product = await Products.find();
  if (!product.length)
    return res.json({ message: "No product currently" }).status(200);
  res.json({ product }).status(200);
});

// get single product
router.get("/:id", AUTH, async (req, res) => {
  try {
    const product = await Products.findById(req.params.id);

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).send("Invalid product ID format");
    }
    if (!product) {
      return res.status(404).send("No product with that ID");
    }

    res.status(200).send(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).send("Server error");
  }
});

// update

router.put("/:id", AUTH, Admin, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).send("Invalid product ID format");
    }
    const product = await Products.findByIdAndUpdate(
      req.params.id,
      {
        price: req.body.price,
        inventory: req.body.inventory,
      },
      { new: true }
    );
    res.json({ product }).status(200);
  } catch (error) {
    res.status(500).json({ error: "Failed to update User" });
  }
});

// delete product
router.delete("/:id", AUTH, Admin, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).send("Invalid product ID format");
    }
    const deletedproduct = await Products.findByIdAndDelete(req.params.id);
    if (!deletedproduct) return res.status(404).send("product not found");
    res.status(200).json({ message: "product  deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete product " });
  }
});

module.exports = router;

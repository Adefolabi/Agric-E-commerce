const mongoose = require("mongoose");
const { Products } = require("../models/Products");
const { searchFunction } = require("../utils");

const createProduct = async (req, res) => {
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
};

const getProduct = async (req, res) => {
  const product = await Products.find();
  if (!product.length)
    return res.json({ message: "No product currently" }).status(200);
  res.json({ product }).status(200);
};

const searchProduct = async (req, res) => {
  try {
    const { search, sort, category, subcategory, inStock, minPrice, maxPrice } =
      req.query;
    console.log(search);
    let query = {};
    console.log(query);
    console.log(search);
    if (search) query = await searchFunction(search);
    // category filter
    if (category) query.category = category;

    //  Subcategory filter
    if (subcategory) query.subcategory = subcategory;

    //  Price range filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }

    // In-stock filter
    if (inStock === "true") {
      query.inventory = { $gt: 0 };
    }

    let product = await Products.find(query)
      .populate("category", "name")
      .populate("subcategory", "name")
      .sort(sort);
    res.status(200).json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).send("Server error");
  }
};

const getSingleProduct = async (req, res) => {
  try {
    const product = await Products.findById(req.params.id)
      .populate("category", "name")
      .populate("subcategory", "name");

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
};

const updateProduct = async (req, res) => {
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
};

const deleteProduct = async (req, res) => {
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
};
module.exports = {
  createProduct,
  getProduct,
  searchProduct,
  getSingleProduct,
  updateProduct,
  deleteProduct,
};

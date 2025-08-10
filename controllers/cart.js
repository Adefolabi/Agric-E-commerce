const mongoose = require("mongoose");
const {Cart} = require("../models/cart");
const {Products} = require("../models/Products");

// create cart
const createCart = async (req, res) => {
  const error = [];
  const userId = req.user.Id;
  let cart = await Cart.findOne({ userId });
  if (!cart) {
    const { item: items } = req.body;
    // Validate item array
    if (!Array.isArray(items) || items.length === 0) {
      return res
        .status(400)
        .json({ error: "Item array is required and cannot be empty." });
    }
    for (const item of items) {
      const { productId } = item;
      // check if ID is valid
      if (!mongoose.Types.ObjectId.isValid(productId)) {
        error.push(`Invalid productId format ${productId}`);
        continue;
      }
      // check if product exist
      const product = await Products.exists({ _id: productId });
      if (!product) {
        error.push(`Product not found: ${productId}`);
      }
    }
    // If there are any validation errors
    if (error.length > 0) {
      return res.status(400).json({ error });
    }

    // If all items are valid, create the cart
    cart = new Cart({ userId, item: items });
    await cart.save();
    return res.status(201).json({ message: "Cart created", cart });
  }
  // If cart already exists
  return res.status(200).json({ message: "Cart already exists", cart });
};


// get cart
const getCart = async (req, res) => {
  const userId = req.user.Id;
  const cart = await Cart.findOne({ userId: userId }).populate(
    "item.productId",
    "name"
  );
  if (!cart) return res.status(404).json({ message: "your have no cart" });
  res.status(200).json({ cart });
};

// clear cart
const clearCart = async (req, res) => {
  const userId = req.user._id || req.user.Id;
  // Find users cart
  let cart = await Cart.findOneAndDelete({ userId });
  if (!cart) {
    return res.status(400).json({ message: "no cart for this user" });
  }
  res.status(200).json({ message: "cart cleared successfully" });
};


// add item to cart
const addItem = async (req, res) => {
  const errors = [];
  const userId = req.user._id || req.user.Id;
  let { item: items } = req.body;

  // Validate items array
  if (!Array.isArray(items) || items.length === 0) {
    return res
      .status(400)
      .json({ error: "Item array is required and cannot be empty." });
  }

  // Find or create cart
  let cart = await Cart.findOne({ userId });
  if (!cart) {
    cart = new Cart({ userId, item: [] });
  }

  // Validate products before adding
  for (const item of items) {
    const { productId, quantity } = item;

    // Validate productId format
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      errors.push(`Invalid productId format: ${productId}`);
      continue;
    }

    // Check if product exists in DB
    const productExists = await Products.exists({ _id: productId });
    if (!productExists) {
      errors.push(`Product not found: ${productId}`);
      continue;
    }

    // If product already in cart and increment quantity
    const existingItem = cart.item.find(
      (p) => p.productId.toString() === productId.toString()
    );

    if (existingItem) {
      existingItem.quantity += quantity || 1;
    } else {
      // Add new product to cart
      cart.item.push({
        productId,
        quantity: quantity || 1,
      });
    }
  }

  // Stop if validation errors
  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  // Save updated cart
  await cart.save();
  return res.status(201).json({ message: "Item(s) added", cart });
};

// update item quantity
const updateItem = async (req, res) => {
  const errors = [];
  const userId = req.user._id || req.user.Id;
  const { quantity } = req.body;
  const productId = req.params.productId;

  // Validate productId format
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    errors.push(`Invalid productId format: ${productId}`);
  }
  // Find users cart
  let cart = await Cart.findOne({ userId });
  if (!cart) {
    return res.status(400).json({ message: "no cart for this user" });
  }

  // Check if product exists in DB
  const productExists = await Products.exists({ _id: productId });
  if (!productExists) {
    errors.push(`Product not found: ${productId}`);
  }
  // Stop if validation errors
  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  // If product already in cart and increment quantity
  const existingItem = cart.item.find(
    (p) => p.productId.toString() === productId.toString()
  );
  if (!existingItem) {
    return res.status(404).json({ message: "Product not in cart" });
  }

  // Update quantity
  existingItem.quantity = quantity || existingItem.quantity + 1;

  // Save updated cart
  await cart.save();
  return res.status(200).json({ message: "Item quantity updated", cart });
};


// remove item from cart 
const removeItem = async (req, res) => {
  const errors = [];

  const userId = req.user._id || req.user.Id;

  const productId = req.params.productId;

  // Validate productId format
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    errors.push(`Invalid productId format: ${productId}`);
  }

  // Find users cart
  let cart = await Cart.findOne({ userId });
  if (!cart) {
    return res.status(400).json({ message: "no cart for this user" });
  }
  // Check if product exists in DB
  const productExists = await Products.exists({ _id: productId });
  if (!productExists) {
    errors.push(`Product not found: ${productId}`);
  }

  // Stop if validation errors
  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }
  // If product already in cart and increment quantity
  const existingItemIndex = cart.item.findIndex(
    (p) => p.productId.toString() === productId.toString()
  );
  if (existingItemIndex === -1) {
    return res.status(404).json({ message: "Product not in cart" });
  }

  // Remove product from cart
  cart.item.splice(existingItemIndex, 1);

  // Save updated cart
  await cart.save();

  return res.status(200).json({ message: "Item deleted", cart });
}


module.exports = { createCart, getCart, clearCart, addItem ,updateItem,removeItem};

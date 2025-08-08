const mongoose = require("mongoose");
const Joi = require("joi");

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    subcategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subcategory",
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    inventory: {
      type: Number,
      default: 0,
    },
    description: {
      type: String,
    },
  },
  { timestamps: true }
);

// Joi Validation Schema
const validateProduct = Joi.object({
  name: Joi.string().required().messages({
    "string.base": "Product name must be a string",
  }),
  category: Joi.string().length(24).hex().required().messages({
    "string.length": "Category ID must be a valid ObjectId",
  }),
  subcategory: Joi.string().length(24).hex().required().messages({
    "string.length": "Subcategory ID must be a valid ObjectId",
  }),
  price: Joi.number().positive().required().messages({
    "number.base": "Price must be a number",
    "number.positive": "Price must be greater than 0",
  }),
  inventory: Joi.number().integer().min(0).messages({
    "number.base": "Inventory must be a number",
  }),
  description: Joi.string().allow("").optional(),
});

const validateUpdateProduct = Joi.object({
  name: Joi.string().optional().messages({
    "string.base": "Product name must be a string",
  }),
  category: Joi.string().length(24).hex().optional().messages({
    "string.length": "Category ID must be a valid ObjectId",
  }),
  subcategory: Joi.string().length(24).hex().optional().messages({
    "string.length": "Subcategory ID must be a valid ObjectId",
  }),
  price: Joi.number().positive().optional().messages({
    "number.base": "Price must be a number",
    "number.positive": "Price must be greater than 0",
  }),
  inventory: Joi.number().integer().min(0).messages({
    "number.base": "Inventory must be a number",
    "number.min": "Inventory cannot be negative",
  }),
  description: Joi.string().allow("").optional(),
});

const Products = mongoose.model("Product", ProductSchema);

module.exports = {
  Products,
  validateProduct,
  validateUpdateProduct,
};

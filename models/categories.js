const Joi = require("joi");
const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
    },
  },
  { timestamps: true }
);

// Joi Validation Schema
const validateCategory = Joi.object({
  name: Joi.string().required().messages({
    "string.base": "Product name must be a string",
    "any.required": "Product name is required",
  }),

  slug: Joi.string().required().messages({
    "string.base": "Product slug must be a string",
    "any.required": "Product slug is required",
  }),

  description: Joi.string().allow("").optional(),
});

const validateUpdateCategory = Joi.object({
  name: Joi.string().optional().messages({
    "string.base": "Product name must be a string",
  }),

  slug: Joi.string().optional().messages({
    "string.base": "Product slug must be a string",
  }),

  description: Joi.string().allow("").optional(),
});

const Category = mongoose.model("Category", CategorySchema);
module.exports = { Category, validateCategory, validateUpdateCategory };

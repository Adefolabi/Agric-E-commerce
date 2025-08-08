const Joi = require("joi");
const mongoose = require("mongoose");

const SubcategoriesSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      lowercase: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
  },
  { timestamps: true }
);

const validateSubcategory = Joi.object({
  name: Joi.string().required().messages({
    "string.base": "Product name must be a string",
    "any.required": "Product name is required",
  }),
  category: Joi.string().length(24).hex().required().messages({
    "string.length": "Category ID must be a valid ObjectId",
    "any.required": "Category is required",
  }),
  slug: Joi.string().required().messages({
    "string.base": "Product slug must be a string",
    "any.required": "Product slug is required",
  }),

  description: Joi.string().allow("").optional(),
});

const validateUpdateSubcategory = Joi.object({
  name: Joi.string().optional().messages({
    "string.base": "Product name must be a string",
  }),
  category: Joi.string().length(24).hex().optional().messages({
    "string.length": "Category ID must be a valid ObjectId",
  }),
  slug: Joi.string().optional().messages({
    "string.base": "Product slug must be a string",
  }),

  description: Joi.string().allow("").optional(),
});
const Subcategory = mongoose.model("Subcategory", SubcategoriesSchema);
module.exports = {
  Subcategory,
  validateSubcategory,
  validateUpdateSubcategory,
};

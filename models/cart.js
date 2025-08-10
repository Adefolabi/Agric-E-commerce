const Joi = require("joi");
const mongoose = require("mongoose");

const cartItem = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  { _id: false }
);

const CartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    item: [cartItem],
  },
  { timestamps: true }
);

const validateCart = Joi.object({
  // userId: Joi.string().length(24).hex().required().messages({
  //   "string.length": "User ID must be a valid 24-character ObjectId",
  //   "any.required": "User ID is required",
  // }),

  item: Joi.array()
    .items(
      Joi.object({
        productId: Joi.string().length(24).hex().required().messages({
          "string.length": "Product ID must be a valid 24-character ObjectId",
          "any.required": "Product ID is required",
        }),

        quantity: Joi.number().integer().min(1).required().messages({
          "number.base": "Quantity must be a number",
          "number.min": "Quantity must be at least 1",
          "any.required": "Quantity is required",
        }),
      })
    )
    .min(1)
    .required()
    .messages({
      "array.base": "Item must be an array",
      "array.min": "At least one product must be included in the cart",
      "any.required": "Item list is required",
    }),
});

const Cart = mongoose.model("Cart", CartSchema);
module.exports = { Cart, validateCart };

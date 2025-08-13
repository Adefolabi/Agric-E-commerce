const mongoose = require("mongoose");
const Joi = require("joi");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    phoneNo: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
    },
    role: {
      type: String,
      enum: ["Admin", "Farmer", "User"],
      default: "User",
    },
    status: {
      type: String,
      enum: ["Active", "Inactive", "Banned"],
      default: "Active",
    },
    farmerDetails: {
      farmName: {
        type: String,
        required: function () {
          return this.role === "Farmer";
        },
      },
      location: String,
      productsOffered: [String],
      certifications: [String],
    },
    shippingAddresses: [
      {
        street: String,
        city: String,
        state: String,
        postalCode: String,
        country: String,
      },
    ],
  },
  { timestamps: true }
);

const validateUser = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().email().required(),
  phoneNo: Joi.string()
    .pattern(/^\+?[0-9]{7,15}$/)
    .required()
    .messages({
      "string.pattern.base":
        "Phone number must be between 7 and 15 digits and may include a leading +",
    }),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid("Admin", "Farmer", "User").required(),
  status: Joi.string().valid("Active", "Inactive", "Banned").optional(),
  farmerDetails: Joi.when("role", {
    is: "Farmer",
    then: Joi.object({
      farmName: Joi.string().required(),
      location: Joi.string().optional(),
      productsOffered: Joi.array().items(Joi.string()).optional(),
      certifications: Joi.array().items(Joi.string()).optional(),
    }),
    otherwise: Joi.forbidden(),
  }),
  shippingAddresses: Joi.array().items(
    Joi.object({
      street: Joi.string().optional(),
      city: Joi.string().optional(),
      state: Joi.string().optional(),
      postalCode: Joi.string().optional(),
      country: Joi.string().optional(),
    })
  ),
});

const validateUpdateUser = Joi.object({
  firstName: Joi.string().optional().messages({
    "string.base": "First name must be a string",
  }),
  lastName: Joi.string().optional().messages({
    "string.base": "Last name must be a string",
  }),
  email: Joi.string().email().optional().messages({
    "string.email": "Invalid email format",
  }),
  phoneNo: Joi.string()
    .pattern(/^[0-9]{7,15}$/)
    .optional()
    .messages({
      "string.pattern.base": "Phone number must be between 7 and 15 digits",
    }),
  password: Joi.string().min(6).optional().messages({
    "string.min": "Password must be at least 6 characters",
  }),
  role: Joi.string().valid("Admin", "Farmer", "User").optional().messages({
    "any.only": "Role must be either Admin, Farmer, or User",
  }),
  status: Joi.string()
    .valid("Active", "Inactive", "Banned")
    .optional()
    .messages({
      "any.only": "Role must be either Active, Inactive, or Banned",
    }),
  farmerDetails: Joi.object({
    farmName: Joi.string().optional(),
    location: Joi.string().optional(),
    productsOffered: Joi.array().items(Joi.string()).optional(),
    certifications: Joi.array().items(Joi.string()).optional(),
  }).optional(),
});
const Users = mongoose.model("User", userSchema);

module.exports = { Users, validateUser, validateUpdateUser };

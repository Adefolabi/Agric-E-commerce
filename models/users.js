const mongoose = require("mongoose");
const Joi = require("joi");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phoneNo: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["Admin", "Farmer", "User"],
      default: "User",
    },
  },
  { timestamps: true }
);

const validateUser = Joi.object({
  firstName: Joi.string().required().messages({
    "string.base": "First name must be a string",
    "any.required": "First name is required",
  }),
  lastName: Joi.string().required().messages({
    "string.base": "Last name must be a string",
    "any.required": "Last name is required",
  }),
  email: Joi.string().email().required().messages({
    "string.email": "Invalid email format",
    "any.required": "Email is required",
  }),
  phoneNo: Joi.string().min(5).max(7).required().messages({
    "string.phoneNo": "Invalid email format",
    "any.required": "Phone number is required",
  }),
  password: Joi.string().min(6).required().messages({
    "string.min": "Password must be at least 6 characters",
    "any.required": "Password is required",
  }),
  role: Joi.string().required().messages({
    "any.required": "Role is required",
  }),
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
  phoneNo: Joi.string().min(5).max(7).optional().messages({
    "string.phoneNo": "Invalid email format",
  }),
  password: Joi.string().min(6).optional().messages({
    "string.min": "Password must be at least 6 characters",
  }),
  role: Joi.string().optional().messages({
    "any.required": "Role is required",
  }),
});

const Users = mongoose.model("User", userSchema);

module.exports = { Users, validateUser, validateUpdateUser };

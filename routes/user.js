const express = require("express");
const router = express.Router();
const { validateUpdateUser } = require("../models/users");
const validate = require("../middleware/Validate");
const {
  getUserProfile,
  searchUser,
  getSingleUser,
  updateUser,
  deleteUser,
  getUser,
  updateUserProfile,
  updateUserRoleStatus,
} = require("../controllers/user");
const AUTH = require("../middleware/Auth");
const Admin = require("../middleware/Admin");

// get user detials
router.get("/profile", AUTH, getUserProfile);

// update user
router.put("/profile", AUTH, validate(validateUpdateUser), updateUserProfile);

// USER MANAGEMENT
// get users
router.get("/", AUTH, Admin, getUser);
// search User
router.get("/search", AUTH, Admin, searchUser);
// get specific user
router.get("/:id", AUTH, Admin, getSingleUser);
// update user
router.put("/:id", AUTH, Admin, validate(validateUpdateUser), updateUser);
// delete user
router.delete("/:id", AUTH, Admin, deleteUser);

// modify user role
router.put(
  "/role/:id",
  AUTH,
  Admin,
  validate(validateUpdateUser),
  updateUserRoleStatus
);
// modify user status
router.put(
  "/status/:id",
  AUTH,
  Admin,
  validate(validateUpdateUser),
  updateUserRoleStatus
);

module.exports = router;

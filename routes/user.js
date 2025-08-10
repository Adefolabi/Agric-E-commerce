const express = require("express");
const router = express.Router();
const { Users, validateUser, validateUpdateUser } = require("../models/users");
const AUTH = require("../middleware/Auth");
const Admin = require("../middleware/Admin");
const validate = require("../middleware/Validate");
const {
  userLogin,
  createUser,
  getUser,
  searchUser,
  getSingleUser,
  updateUser,
  deleteUser,
} = require("../controllers/user");

// USER LOGIN
router.post("/login", userLogin);
// create users
router.post("/", validate(validateUser), createUser);

// get users
router.get("/", AUTH, Admin, getUser);
// search users
router.get("/search", AUTH, Admin, searchUser);
// get specific user
router.get("/:id", AUTH, Admin, getSingleUser);

// update user
router.put("/:id", AUTH, Admin, validate(validateUpdateUser), updateUser);

// delete user
router.delete("/:id", AUTH, Admin,deleteUser);

module.exports = router;

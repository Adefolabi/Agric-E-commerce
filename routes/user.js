const express = require("express");
const router = express.Router();
const { validateUser, validateUpdateUser } = require("../models/users");
const validate = require("../middleware/Validate");
const { userLogin, createUser, updateUser } = require("../controllers/user");
const Farmer = require("../middleware/farmer");
const AUTH = require("../middleware/Auth");

// USER LOGIN
router.post("/login", userLogin);
// create users
router.post("/", validate(validateUser), createUser);
// update user
router.put("/user/:id", AUTH, validate(validateUpdateUser), updateUser);

module.exports = router;

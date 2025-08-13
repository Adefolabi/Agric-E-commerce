const express = require("express");
const router = express.Router();
const { validateUser } = require("../models/users");
const validate = require("../middleware/Validate");
const { Login, createUser } = require("../controllers/Auth");

// USER LOGIN
router.post("/login", Login);
// create users
router.post("/register", validate(validateUser), createUser);

module.exports = router;

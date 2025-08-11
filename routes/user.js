const express = require("express");
const router = express.Router();
const { validateUser } = require("../models/users");
const validate = require("../middleware/Validate");
const { userLogin, createUser } = require("../controllers/user");

// USER LOGIN
router.post("/login", userLogin);
// create users
router.post("/", validate(validateUser), createUser);

module.exports = router;

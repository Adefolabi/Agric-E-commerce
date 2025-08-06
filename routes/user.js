const express = require("express");
const router = express.Router();
const Users = require("../models/users");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { hashFunction } = require("../utils");
const AUTH = require("../middleware/Auth");
const Admin = require("../middleware/Admin");
const SECRET_KEY = process.env.SECRET_KEY;
const EXPIRES_IN = process.env.EXPIRES_IN;

// USER LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const User = await Users.findOne({ email: email });
    // check email and password
    if (!User || !(await bcrypt.compare(password, User.password)))
      return res.send("invalide credentials").status(401);
    const token = jwt.sign({ Id: User._id, role: User.role }, SECRET_KEY, {
      expiresIn: EXPIRES_IN,
    });
    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "something went wrong" });
  }
});
// create users
router.post("/", async (req, res) => {
  try {
    const hashedpassword = await hashFunction(req.body.password);
    let User = new Users({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      phoneNo: req.body.phoneNo,
      email: req.body.email,
      password: hashedpassword,
      role: req.body.role,
    });
    if (!User) {
      return res.send("invalid User ").status(400);
    }
    User = await User.save();
    res.json({ User }).status(201);
  } catch (error) {
    if (error.code === 11000) {
      console.log("duplicate category");
      res.status(400).json({ error: "category already exists" });
    } else {
      console.error(error);
      res.status(500).json({ error: "Server error" });
    }
    res.json({ message: error }).status(500);
  }
});

// get users
router.get("/", AUTH, Admin, async (req, res) => {
  const User = await Users.find().select("-password");
  if (!User) return res.send("no User available").status(404);
  res.send(User).status(200);
});

// get specific User
router.get("/:id", AUTH, Admin, async (req, res) => {
  const User = await Users.find().select("-password").findById(req.params.id);
  if (!User) return res.send("no User with that id ").status(404);
  res.send(User).status(200);
});

// update User
router.put("/:id", AUTH, Admin, async (req, res) => {
  try {
    const User = await Users.findByIdAndUpdate(
      req.params.id,
      {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        phoneNo: req.body.phoneNo,
        email: req.body.email,
        password: req.body.password,
        role: req.body.role,
      },
      { new: true }
    );
    res.send(User).status(201);
  } catch (error) {
    res.status(500).json({ error: "Failed to update User" });
  }
});

// delete User
router.delete("/:id", AUTH, Admin, async (req, res) => {
  try {
    await Users.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete User" });
  }
});

module.exports = router;

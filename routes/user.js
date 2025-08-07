const express = require("express");
const router = express.Router();
const Users = require("../models/users");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { hashFunction, searchFunction } = require("../utils");
const AUTH = require("../middleware/Auth");
const Admin = require("../middleware/Admin");
const SECRET_KEY = process.env.SECRET_KEY;
const EXPIRES_IN = process.env.EXPIRES_IN;

// USER LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await Users.findOne({ email: email });
    // check email and password
    if (!user || !(await bcrypt.compare(password, user.password)))
      return res.send("invalide credentials").status(401);
    const token = jwt.sign({ Id: user._id, role: user.role }, SECRET_KEY, {
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
    const hashedPassword = await hashFunction(req.body.password);

    const user = new Users({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      phoneNo: req.body.phoneNo,
      email: req.body.email,
      password: hashedPassword,
      role: req.body.role,
    });

    const savedUser = await user.save();

    res.status(201).json({ user: savedUser });
  } catch (error) {
    if (error.code === 11000) {
      console.log("Duplicate email");
      return res.status(400).json({ error: "Email already exists" });
    }

    console.error("Server error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// get users
router.get("/", AUTH, Admin, async (req, res) => {
  const user = await Users.find().select("-password");
  if (!user) return res.send("no user available").status(404);
  res.send(user).status(200);
});
// search users
router.get("/search",AUTH,Admin, async (req, res) => {
  try {
    const { search } = req.query;
      let query = {};
    console.log(search);
    if (search)
      query = await searchFunction(search);    
    const user = await Users.find(query);
    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).send("Server error");
  }
});
// get specific user
router.get("/:id", AUTH, Admin, async (req, res) => {
  const user = await Users.findById(req.params.id).select("-password");

  if (!user) return res.status(404).send("No user with that ID");

  res.status(200).send(user);
});

// update user
router.put("/:id", AUTH, Admin, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).send("Invalid product ID format");
    }
    const user = await Users.findByIdAndUpdate(
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

    if (!user) {
      return res.status(404).send("User not found");
    }

    res.status(200).send(user);
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ error: "Failed to update user" });
  }
});

// delete user
router.delete("/:id", AUTH, Admin, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).send("Invalid product ID format");
    }
    const deletedUser = await Users.findByIdAndDelete(req.params.id);

    if (!deletedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ error: "Failed to delete user" });
  }
});

module.exports = router;

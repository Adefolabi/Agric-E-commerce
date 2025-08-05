const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Users = require("../models/users");

// create users
router.post("/", async (req, res) => {
  let user = new Users({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    role: req.body.role,
    createdAt: new Date().toISOString(),
  });
  if (!user) {
    return res.send("invalid user ").status(400);
  }
  user = await user.save();
  res.json({ user }).status(201);
});

// get users
router.get("/", async (req, res) => {
  const user = await Users.find().select("-password");
  if (!user) return res.send("no user available").status(404);
  res.send(user).status(200);
});

// get specific user
router.get("/:id", async (req, res) => {
  const user = await Users.find().select("-password").findById(req.params.id);
  if (!user) return res.send("no user with that id ").status(404);
  res.send(user).status(200);
});

// update user
router.put("/:id", async (req, res) => {
  try {
    const user = await Users.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        role: req.body.role,
        UpdatedAt: new Date().toISOString(),
      },
      { new: true }
    );
    res.send(user).status(201);
  } catch (error) {
    res.status(500).json({ error: "Failed to delete user" });
  }
});

// delete user
router.delete("/:id", async (req, res) => {
  try {
    await Users.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete user" });
  }
});

module.exports = router;

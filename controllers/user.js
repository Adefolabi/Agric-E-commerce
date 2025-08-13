const mongoose = require("mongoose");
const { Users } = require("../models/users");
const { searchFunction } = require("../utils");

// aget users -admin
const getUser = async (req, res) => {
  const user = await Users.find().select("-password");
  if (!user) return res.send("no user available").status(404);
  res.send(user).status(200);
};

// search users -admin
const searchUser = async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};
    console.log(search);
    if (search) query = await searchFunction(search);
    const user = await Users.find(query);
    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).send("Server error");
  }
};

// get single user -admin
const getSingleUser = async (req, res) => {
  const user = await Users.findById(req.params.id).select("-password");

  if (!user) return res.status(404).send("No user with that ID");

  res.status(200).send(user);
};

// update user -admin
const updateUser = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).send("Invalid product ID format");
    }
    const userExists = await Users.findById(req.params.id);
    if (!userExists) {
      return res.status(404).send("User not found");
    }
    if (req.user !== userExists._id.toString() && req.user.role !== "admin")
      return res.status(403).send("You are not authorized to update this user");
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

    res.status(200).send(user);
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ error: "Failed to update user" });
  }
};

// get user profile
const getUserProfile = async (req, res) => {
  if (req.user.role === "farmer") {
    const user = await Users.findById(req.user.Id).select("-password");
    return res.status(404).send("No user with that ID");
  }
  const user = await Users.findById(req.user.Id).select(
    "-password -farmerDetails"
  );

  if (!user) return res.status(404).send("No user with that ID");

  res.status(200).send(user);
};

// update user profile
const updateUserProfile = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.user.Id)) {
      return res.status(400).send("Invalid product ID format");
    }
    const userExists = await Users.findById(req.user.Id);
    console.log(userExists);
    if (!userExists) {
      return res.status(404).send("User not found");
    }
    if (req.user.Id !== userExists._id.toString())
      return res.status(403).send("You are not authorized to update this user");
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

    res.status(200).json({ message: "User updated SUCCESSFULY" });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ error: "Failed to update user" });
  }
};
const deleteUser = async (req, res) => {
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
};

// update user role and status
const updateUserRoleStatus = async (req, res) => {
  try {
    const { role, status } = req.body;
    if (!role && !status) {
      return res.status(400).json({ error: "No fields to update" });
    }
    const user = await Users.findByIdAndUpdate(
      req.params.id,
      { role, status },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ error: "Failed to update user" });
  }
};

module.exports = {
  getUser,
  searchUser,
  getUserProfile,
  updateUserProfile,
  getSingleUser,
  updateUser,
  deleteUser,
  updateUserRoleStatus,
};

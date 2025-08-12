const mongoose = require("mongoose");
const { Users } = require("../models/users");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const SECRET_KEY = process.env.SECRET_KEY;
const EXPIRES_IN = process.env.EXPIRES_IN;
const { hashFunction, searchFunction } = require("../utils");
const { sendAccountCreationEmail, sendAccountLoginEmail } = require("./email");

const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await Users.findOne({ email: email });
    // check email and password
    if (!user || !(await bcrypt.compare(password, user.password)))
      return res.send("invalide credentials").status(401);
    const token = jwt.sign(
      { Id: user._id, role: user.role, status: user.status },
      SECRET_KEY,
      {
        expiresIn: EXPIRES_IN,
      }
    );
    res.json({ token });
    // // login time
    // const loginTime = new Date().toLocaleString();
    sendAccountLoginEmail(req,email);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "something went wrong" });
  }
};
const createUser = async (req, res) => {
  try {
    const hashedPassword = await hashFunction(req.body.password);

    const user = new Users({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      phoneNo: req.body.phoneNo,
      email: req.body.email,
      password: hashedPassword,
      role: req.body.role,
      status: req.body.status,
      farmerDetails: req.body.farmerDetails,
      shippingAddresses: req.body.shippingAddresses,
    });

    const savedUser = await user.save();
    sendAccountCreationEmail(req.body.email);
    res.status(201).json({ user: savedUser });
  } catch (error) {
    if (error.code === 11000) {
      console.log("Duplicate email");
      return res.status(400).json({ error: "Email already exists" });
    }

    console.error("Server error:", error);
    res.status(500).json({ error: "Server error" });
  }
};
const getUser = async (req, res) => {
  const user = await Users.find().select("-password");
  if (!user) return res.send("no user available").status(404);
  res.send(user).status(200);
};
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
const getSingleUser = async (req, res) => {
  const user = await Users.findById(req.params.id).select("-password");

  if (!user) return res.status(404).send("No user with that ID");

  res.status(200).send(user);
};
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
  userLogin,
  createUser,
  getUser,
  searchUser,
  getSingleUser,
  updateUser,
  deleteUser,
  updateUserRoleStatus,
};

const { Users } = require("../models/users");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const SECRET_KEY = process.env.SECRET_KEY;
const EXPIRES_IN = process.env.EXPIRES_IN;
const { sendAccountLoginEmail, sendAccountCreationEmail } = require("./email");
const { hashFunction } = require("../utils");

const Login = async (req, res) => {
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
    sendAccountLoginEmail(req, email);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "something went wrong" });
  }
};

const createUser = async (req, res) => {
  try {
    const hashedPassword= await hashFunction(req.body.password);

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
module.exports = {
  Login,
  createUser,
};

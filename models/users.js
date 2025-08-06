const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phoneNo: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["Admin", "Farmer", "User"],
    default: "User",
  },
  createdAt: {
    type: String,
    required: true,
  },
  UpdatedAt:String,
});

const Users = mongoose.model("User", userSchema);

module.exports = Users;

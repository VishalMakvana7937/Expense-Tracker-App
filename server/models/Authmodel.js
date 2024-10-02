const mongoose = require("mongoose");

const UserDetailsSchema = new mongoose.Schema(
  {
    fname: { type: String, required: true },
    lname: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    userType: { type: String, required: true },
  },
  {
    collection: "UserInfo",
  }
);

const User = mongoose.model("UserInfo", UserDetailsSchema); // Ensure the model is defined correctly

module.exports = User; // Export the User model

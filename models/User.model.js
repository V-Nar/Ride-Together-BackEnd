const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  username: {
    type: String,
    unique: true,
    required: true,
  },
  password: { type: String, required: true },
  level: {
    type: String,
    enum: ["Beginner", "Medium", "Advanced", "Expert"],
  },
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },
  email: {
    type: String,
    unique: true,
  },
});

const User = model("User", userSchema);

module.exports = User;

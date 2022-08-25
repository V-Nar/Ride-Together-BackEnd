const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
    },
    password: { type: String, required: true, minlength: 8 },
    level: {
      type: String,
      enum: [BEGINNER, MEDIUM, ADVANCED, EXPERT],
    },
    role: {
      type: String,
      enum: [ADMIN, USER],
      default: "USER",
    },
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const User = model("User", userSchema);

module.exports = User;

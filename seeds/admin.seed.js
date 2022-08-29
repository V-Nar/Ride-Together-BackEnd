const mongoose = require("mongoose");
const User = require("../models/User.model");
require("dotenv/config");
const bcrypt = require("bcryptjs");
const MONGODBSEED_URI = process.env.MONGODB_URI;
const password = "adminpassword1";
const hashedPassword = bcrypt.hashSync(password);

const admin = {
  username: "admin1",
  password: hashedPassword,
  role: "admin",
};

mongoose
  .connect(MONGODBSEED_URI)
  .then((x) => {
    console.log(
      `Connected to Mongo! Database name: "${x.connections[0].name}"`
    );
    return User.deleteMany({ role: "admin" });
  })
  .then(async () => {
    await User.create(admin);
    console.log("admin created");
  })
  .then(async () => {
    await mongoose.disconnect();
    console.log("disconnected");
  })
  .catch((err) => {
    console.error("Error connecting to mongo: ", err);
  });

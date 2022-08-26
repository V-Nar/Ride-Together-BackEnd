const router = require("express").Router();
const User = require("../models/User.model");
const bcrypt = require("bcryptjs");

router.get("/", (req, res, next) => {
  res.json("All good in here");
});

// Signing up routes
router.post("/signup", async (req, res, next) => {
  const { username, password, level, role } = req.body;
  try {
    const foundUser = await User.findOne({ username });
    //If username already in use return bad request
    if (foundUser) {
      return res.status("400").send({
        message:
          "username already in use, try singning up with a different username",
      });
    }
    // if password not long enough return bad request
    if (password.length < 8) {
      return res.status("411").send({ message: "invalid password length" });
    }
    // encrypt password for security reason
    const hashedPassword = bcrypt.hashSync(password);
    const newUser = {
      username,
      password: hashedPassword,
      level,
      role,
    };
    const createdUser = await User.create(newUser);
    res.status(201).json(createdUser);
  } catch (error) {
    next(error);
  }
});

module.exports = router;

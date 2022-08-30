const {
  checkValidityOfPassword,
  wrongPassword,
  checkValidityUsername,
  wrongUsername,
} = require("../utils/functions-gatherer");
const router = require("express").Router();
const User = require("../models/User.model");
const bcrypt = require("bcryptjs");
const jsonWebToken = require("jsonwebtoken");
nodemailer = require(`nodemailer`);

/**
 * All routes are prefixed with /api/auth
 */

// Signing up routes
router.post("/signup", async (req, res, next) => {
  const { username, password, level, role, email } = req.body;
  try {
    const foundUser = await User.findOne({ username });
    //If username already in use return bad request
    if (foundUser) {
      return res.status("400").send({
        message:
          "username already in use, try singning up with a different username",
      });
    }
    if (!checkValidityUsername(username)) {
      wrongUsername(res);
      return;
    }
    // if password does not meet requirement return bad request
    if (!checkValidityOfPassword(password)) {
      wrongPassword(res);
      return;
    }
    // encrypt password for security reason
    const hashedPassword = bcrypt.hashSync(password);
    const newUser = {
      username,
      password: hashedPassword,
      level,
      role,
      email,
    };
    const createdUser = await User.create(newUser);
    res.status(201).json({ message: `User ${username} created` });
  } catch (error) {
    next(error);
  }
});

// User login method
router.post("/login", async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const foundUser = await User.findOne({ username });
    if (!foundUser) {
      res
        .status(400)
        .json({ message: "could not find an account with this username" });
    }
    const matchingPassword = bcrypt.compareSync(password, foundUser.password);
    if (!matchingPassword) {
      res.status(400).json({ message: "wrong password" });
    }
    const payload = { username };
    const token = jsonWebToken.sign(payload, process.env.TOKEN_SECRET, {
      algorithm: "HS256",
      expiresIn: "10d",
    });
    res.status(200).json(token);
  } catch (error) {
    next(error);
  }
});

// User reseting password. It send a reset email with specific token to the user.
//It will then use the provided username/password to update the previous one.
router.patch(`/reset-password`, async (req, res, next) => {
  try {
    const { username, password } = req.body;
    let resetToken = req.query.token;

    if (resetToken) {
      const { username } = jsonWebToken.verify(
        resetToken,
        process.env.TOKEN_SECRET
      );
      if (!password) {
        res.status(400).json({
          errors: {
            password: `To reset your password, please provide a new one`,
          },
        });
        return;
      }

      if (!checkValidityOfPassword(password)) {
        wrongPassword(res);
        return;
      }
      if (!checkValidityUsername(username)) {
        wrongUsername(res);
        return;
      }

      hashedPassword = await bcrypt.hashSync(password);

      await User.findOneAndUpdate({ username }, { password: hashedPassword });

      res.status(200).json({
        message: `You've successfully updated your password! Please login to continue.`,
      });
    }

    if (!username) {
      res.status(400).json({
        errors: {
          username: `To reset your password, please provide a username`,
        },
      });
      return;
    }

    const foundUser = await User.findOne({ username });
    if (!foundUser) {
      // return res
      //   .status(400)
      //   .send({
      //     message:
      //       "The specified username does not existe please provide the username used when creating your account",
      //   });
      return res.status(400).json({ errors: { id: "It is not a valid ID" } });
    }

    resetToken = jsonWebToken.sign({ username }, process.env.TOKEN_SECRET, {
      algorithm: `HS256`,
      expiresIn: `15m`,
    });

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // use .env for the from field
    const emailResMsg = await transporter.sendMail({
      from: `'Ride-Together ' <${process.env.EMAIL_USERNAME}>`,
      to: foundUser.email,
      subject: "Password Reset Link",
      text: `${process.env.BASE_URL}/auth/reset-password/?token=${resetToken}`,
    });

    console.log(emailResMsg);

    res
      .status(200)
      .json({ message: `A password reset link was sent to your email!` });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

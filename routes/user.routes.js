const router = require("express").Router();
const { json } = require("express");
const { findByIdAndUpdate } = require("../models/User.model");
const User = require("../models/User.model");
const bcrypt = require("bcryptjs");
const { isAuthenticated, isAdmin } = require("../middleware/middleware");

/**
 * All routes are prefixed with /api/user
 */

//Display every user signed up
router.get("/", async (req, res, next) => {
  try {
    const allUser = await User.find();
    res.status("200").json(allUser);
  } catch (error) {
    next(error);
  }
});

//Display profile of specific user
router.get("/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const thisUser = await User.findById(id);
    res.status("200").json(thisUser);
  } catch (error) {
    next(error);
  }
});

// update user profile
router.patch("/:id", isAuthenticated, async (req, res, next) => {
  try {
    const { id } = req.user;
    const { password, level } = req.body;
    // encrypt password for security reason
    const hashedPassword = bcrypt.hashSync(password);
    const updateCharacter = await User.findByIdAndUpdate(
      id,
      { password: hashedPassword, level },
      {
        new: true,
      }
    );
    res.status("201").json(updateCharacter);
  } catch (error) {
    next("error");
  }
});

// delete user profile
router.delete(
  "/deleteprofile/:id",
  isAuthenticated,
  isAdmin,
  async (req, res, next) => {
    try {
      await User.findByIdAndDelete(req.params.id);
      return res.status("201").send(`Character deleted : ${req.params.id}`);
    } catch (error) {
      next(error);
    }
  }
);
//delete own profile
router.delete("/deleteprofile", isAuthenticated, async (req, res, next) => {
  try {
    const { id } = req.user;
    await User.findByIdAndDelete(id);
    return res.status("201").send(`Character deleted : ${id}`);
  } catch (error) {
    next(error);
  }
});
module.exports = router;

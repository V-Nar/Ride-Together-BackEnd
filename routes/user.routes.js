const router = require("express").Router();
const { json } = require("express");
const { findByIdAndUpdate } = require("../models/User.model");
const User = require("../models/User.model");

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
router.patch("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const newUpdatedCharacter = req.body;
    const foundId = await User.findById(id);
    if (foundId) {
      const updatedCharacter = await User.findByIdAndUpdate(
        id,
        newUpdatedCharacter,
        {
          new: true,
        }
      );
      res.status("201").json(updatedCharacter);
    } else {
      return res.json({ message: "character not found" });
    }
  } catch (error) {
    next("error");
  }
});

// delete user profile
router.delete("/:id", async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    return res.status("201").send(`Character deleted : ${req.params.id}`);
  } catch (error) {
    next(error);
  }
});
module.exports = router;

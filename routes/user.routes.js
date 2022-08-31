const router = require("express").Router();
const { json } = require("express");
const { findByIdAndUpdate } = require("../models/User.model");
const User = require("../models/User.model");
const bcrypt = require("bcryptjs");
const { isAuthenticated, isAdmin } = require("../middleware/middleware");
const Attendees = require("../models/attendees.model");

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
router.delete("/deleteprofile/:id", isAuthenticated, async (req, res, next) => {
  try {
    if (req.user.role === "admin" || req.user.id === req.params.id) {
      await User.findByIdAndDelete(req.params.id);
      return res.status("201").send(`Character deleted : ${req.params.id}`);
    }

    res.sendStatus(301).json({ message: `Account deleted!` }); // do some stuff
  } catch (error) {
    next(error);
  }
});
//get the list of event that i joined
router.get(
  "/joined/my-joined-event",
  isAuthenticated,
  async (req, res, next) => {
    try {
      const myListOfEvent = await Attendees.find({
        user: req.user.id,
      }).populate({
        path: "event",
        match: { isFinished: false },
        select: "title city date -_id",
      });
      res.status(202).send({ "My joined event": myListOfEvent });
    } catch (error) {
      next(error);
    }
  }
);
module.exports = router;

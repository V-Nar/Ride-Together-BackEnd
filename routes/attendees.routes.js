const { isAuthenticated } = require("../middleware/middleware");
const Attendees = require("../models/attendees.model");
const router = require("express").Router();

/**
 * All routes are prefixed with /api/attendees
 */

router.get("/getAttendees/:id", isAuthenticated, async (req, res, next) => {
  try {
    // const { id } = req.user;
    const idEvent = req.params.id;
    await Attendees.findById(idEvent);
  } catch (error) {
    next(error);
  }
});

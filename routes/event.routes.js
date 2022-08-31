const router = require("express").Router();
const User = require("../models/User.model");
const Event = require("../models/Event.model");
const Attendees = require("../models/attendees.model");
const {
  isAuthenticated,
  isAdminOrPromoter,
} = require("../middleware/middleware");
const { findOneAndDelete } = require("../models/attendees.model");
const { find } = require("../models/User.model");

/**
 * all routes are prefix by /api/event
 */

// event creation
router.post("/newEvent", isAuthenticated, async (req, res, next) => {
  const { title, date, city } = req.body;
  Date.now();
  try {
    const newEvent = await Event.create({
      title,
      date,
      city,
      promoter: req.user.id,
    });
    res.status(201).json({ newEvent });
  } catch (error) {
    next(error);
  }
});

// event calling
router.get("/event-list", async (req, res, next) => {
  const city = req.query.city;
  try {
    if (city) {
      const cityEvents = await Event.find({ city });
      return res.status(302).json({ cityEvents });
    }
    res.status(302).json(await Event.find());
  } catch (error) {
    next(error);
  }
});

// event update
router.patch(
  "/update-event/:id",
  isAuthenticated,
  isAdminOrPromoter,
  async (req, res, next) => {
    const { title, date } = req.body;
    const { id } = req.params;
    try {
      await Event.findByIdAndUpdate(id, { title, date }, { new: true });
      res.status(202).json(await Event.findById(req.params.id));
    } catch (error) {
      next(error);
    }
  }
);

// closeEvent event route
router.patch(
  "/:id",
  isAuthenticated,
  isAdminOrPromoter,
  async (req, res, next) => {
    try {
      await Event.findByIdAndUpdate(
        req.params.id,
        { isFinished: true },
        { new: true }
      );
      res.status(202).json({ message: `event has been closed!` });
    } catch (error) {
      next(error);
    }
  }
);

// delete event
router.delete("/deleteEvent/:id", isAuthenticated, async (req, res, next) => {
  try {
    const idEvent = req.params.id;
    await Event.findByIdAndDelete(idEvent);
    res.status(201).send({ message: `Event deleted : ${idEvent}` });
  } catch (error) {
    next(error);
  }
});

router.post("/:id/join", isAuthenticated, async (req, res, next) => {
  try {
    const joinEvent = await Attendees.findOneAndUpdate(
      {
        event: req.params.id,
        user: req.user.id,
      },
      {},
      { upsert: true }
    );
    res.status(202).json({ joinEvent });
  } catch (error) {
    next(error);
  }
});

router.delete("/:id/leave", isAuthenticated, async (req, res, next) => {
  try {
    await Attendees.findOneAndDelete({
      event: req.params.id,
      user: req.user.id,
    });
    res.status(202).send({
      message: `You are no longer taking part of this event : ${req.params.id}`,
    });
  } catch (error) {
    next(error);
  }
});

router.get("/:id/attendeeslist", isAuthenticated, async (req, res, next) => {
  try {
    const listOfAttendees = await Attendees.find({ event: req.params.id });
    res.status(202).send({
      "Number of attendees": listOfAttendees.length,
      "list of Attendees": listOfAttendees,
    });
  } catch (error) {
    next(error);
  }
});

router.get("/my-joined-event", isAuthenticated, async (req, res, next) => {
  try {
    const myListOfEvent = await Attendees.find({ user: req.user.id });
    res.status(202).send({ "My joined event": myListOfEvent });
  } catch (error) {
    next(error);
  }
});
module.exports = router;

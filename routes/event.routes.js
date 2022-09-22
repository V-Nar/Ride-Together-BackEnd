const router = require("express").Router();
const User = require("../models/User.model");
const Event = require("../models/Event.model");
const Attendees = require("../models/attendees.model");
const {
  isAuthenticated,
  isAdminOrPromoter,
} = require("../middleware/middleware");

/**
 * all routes are prefix by /api/event
 */

/**
 * EVENT MANAGEMENT ROUTES
 *
 */

// event creation
router.post("/", isAuthenticated, async (req, res, next) => {
  const { title, date, address, city } = req.body;
  Date.now();
  try {
    const newEvent = await Event.create({
      title,
      date,
      address,
      city,
      promoter: req.user.id,
    });
    res.status(201).json({ newEvent });
  } catch (error) {
    next(error);
  }
});

// event update
router.patch(
  "/:id",
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

// close event manually
router.patch(
  "/close/:id",
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

// cancel an event
router.delete(
  "/:id",
  isAuthenticated,
  isAdminOrPromoter,
  async (req, res, next) => {
    try {
      const idEvent = req.params.id;
      await Event.findByIdAndDelete(idEvent);
      await Attendees.deleteMany({ event: `${idEvent}` });
      res.status(301).send({ message: `Event deleted : ${idEvent}` });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * EVENTS INTERACTIONS ROUTES
 */

// events search

router.get("/", async (req, res, next) => {
  const city = req.query.city;
  const finished = req.query.isFinished === "true" ? true : false;

  try {
    if (city) $match = { city: { $in: [city].flat() } };

    const cityEvents = await Event.aggregate([
      {
        $match: { isFinished: finished },
      },
      {
        $lookup: {
          from: "attendees",
          localField: "_id",
          foreignField: "event",
          as: "count",
        },
      },
      {
        $project: {
          title: 1,
          date: 1,
          city: 1,
          numOfAttendees: {
            $size: "$count",
          },
        },
      },
    ]);

    return res.status(200).json({ cityEvents });
  } catch (error) {
    next(error);
  }
});

// display full event infos
router.get("/:id", isAuthenticated, async (req, res, next) => {
  const { id } = req.params;
  try {
    const eventDetails = await Event.findById(id);
    let eventAttendees = await Attendees.find({ event: id }, "user").populate({
      path: "user",
      select: "username -_id",
    });

    // keep this code commented, it will be added to front or kept here, no use yet
    // eventAttendees = eventAttendees.map((x) => x.user.username);

    res.status(200).json({
      eventDetails,
      eventAttendees,
    });
  } catch (error) {
    next(error);
  }
});

// join an event
router.post("/attend/:id", isAuthenticated, async (req, res, next) => {
  try {
    const joinEvent = await Attendees.findOneAndUpdate(
      {
        event: req.params.id,
        user: req.user.id,
      },
      {},
      { upsert: true, new: true, select: { user: 1, _id: 1 } }
    ).populate({
      path: "user",
      select: { username: 1, _id: 0 },
    });
    res.status(202).json(joinEvent);
  } catch (error) {
    next(error);
  }
});

// leave an event
router.delete("/attend/:id", isAuthenticated, async (req, res, next) => {
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

module.exports = router;

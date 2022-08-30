const router = require("express").Router();
const User = require("../models/User.model");
const Event = require("../models/Event.model");
const {
  isAuthenticated,
  isAdminOrPromoter,
} = require("../middleware/middleware");

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

})

// isFinished event route
router.patch('/finish-event/', isAuthenticated, isAdminOrPromoter, async (req, res, next) => {
    const { isFinished, date } = req.body;
    const now = new Date();
    try {
      const pastEvent = await Event.find(date)
    } catch(error) {
        next(error)
    }
});

// delete event
router.delete("/deleteEvent/:id", isAuthenticated, async (req, res, next) => {
  try {
    const idEvent = req.params.id;
    await Event.findByIdAndDelete(idEvent);
    res.status("201").send({ message: `Event deleted : ${idEvent}` });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

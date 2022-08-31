const router = require("express").Router();

router.get("/", (req, res, next) => {
  res.json("All good in here");
});

router.use("/user", require("./user.routes"));
router.use("/auth", require("./auth.routes"));
router.use("/event", require("./event.routes"));

module.exports = router;

const jsonWebToken = require("jsonwebtoken");
const User = require("../models/User.model");
const Event = require("../models/Event.model");

const isAuthenticated = async (req, res, next) => {
  let token = req.headers.authorization;
  if (!token) {
    return res.status(400).json({ message: "No token found!" });
  }
  token = token.replace("Bearer ", "");
  const userToken = jsonWebToken.verify(token, process.env.TOKEN_SECRET);
  try {
    const user = await User.findOne({ username: userToken.username });
    if (!user) {
      return res.status(400).json({ message: "Invalid token" });
    }
    req.user = user;
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
  next();
};

const isAdmin = (req, res, next) => {
  if (req.user.role === "admin") {
    next();
  } else {
    return res.status(401).json({ message: "Denied !" });
  }
};

const isAdminOrPromoter = async (req, res, next) => {
  const eventToUpdate = await Event.findById(req.params.id);
  const isSameUser = eventToUpdate.promoter.toString() === req.user.id;
  if (isSameUser) {
    return next();
  }
  res
    .status(401)
    .json({ message: `You are not authorized to modify this event` });
};

module.exports = { isAuthenticated, isAdmin, isAdminOrPromoter };

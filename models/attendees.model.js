const { Schema, model } = require("mongoose");

const attendeesSchema = new Schema({
  event: {
    type: Schema.Types.ObjectId,
    ref: "Event",
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

const Attendees = model("Attendees", attendeesSchema);

module.exports = Attendees;

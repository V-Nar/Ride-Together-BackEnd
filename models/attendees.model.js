const { Schema, model } = require("mongoose");

const attendeeSchema = new Schema({
  event: {
    type: Schema.Types.ObjectId,
    ref: "Event",
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

const Attendee = model("Attendee", attendeeSchema);

module.exports = Attendee;

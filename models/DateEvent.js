const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const dateEventSchema = new Schema(
  {
    eventName: {
      type: String,
      required: true,
    },
    eventDate: {
      type: String,
      required: true,
    },
    eventLocation: {
      type: String,
      required: true,
    },
    eventDescription: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const DateEvent = mongoose.model('DateEvent', dateEventSchema);

module.exports = {
  DateEvent: DateEvent,
};


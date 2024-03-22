const { errorHandling } = require('../../middlewares/errorHandling');
const { DateEvent } = require('../../models/DateEvent');

exports.getAllEvents = async (req, res, next) => {
  const eventLocation = req.query.eventLocation;
  const eventDate = req.query.eventDate;

  try {
    if (eventLocation && eventDate) {
      const filteredByAllFilters = await DateEvent.find({
        $and: [
          {
            eventLocation,
            eventDate,
          },
        ],
      });

      if (filteredByAllFilters.length == 0)
        errorHandling(
          `400|No events with event location - ${eventLocation} and event date - ${eventDate} found.|`,
        );

      // filtered By Date Events
      res.status(200).json({
        message: `All Date events with event location - ${eventLocation} and event date - ${eventDate} retrieved successfully.`,
        statusCode: 200,
        data: filteredByAllFilters,
      });
    } else if (eventLocation) {
      const filteredByLocation = await DateEvent.find({
        eventLocation,
      });

      if (filteredByLocation.length == 0)
        errorHandling(
          `400|No events with event location - ${eventLocation} found.|`,
        );

      // filtered By Location Events
      res.status(200).json({
        message: `All Date events with event location - ${eventLocation} retrieved successfully.`,
        statusCode: 200,
        data: filteredByLocation,
      });
    } else if (eventDate) {
      const filteredByDate = await DateEvent.find({
        eventDate,
      });

      if (filteredByDate.length == 0)
        errorHandling(`400|No events with event date - ${eventDate} found.|`);

      // filtered By Date Events
      res.status(200).json({
        message: `All Date events with event date - ${eventDate} retrieved successfully.`,
        statusCode: 200,
        data: filteredByDate,
      });
    }
    // No filter
    else {
      const events = await DateEvent.find();
      if (!events) errorHandling(`400|No events found.|`);

      // All events
      res.status(200).json({
        message: 'All Date events retrieved successfully.',
        statusCode: 200,
        data: events,
      });
    }
  } catch (e) {
    next(new Error(e.stack));
  }
};

exports.getSingleEvent = async (req, res, next) => {
  const eventID = req.query.eventID;

  try {
    const existingEvent = await DateEvent.findById(eventID);
    if (!existingEvent) {
      errorHandling(`401|Event does not exists.|`);
    } else {
      res.status(200).json({
        statusCode: 200,
        message: 'Date event retrieved successfully.',
        data: existingEvent,
      });
    }
  } catch (e) {
    next(new Error(e.stack));
  }
};

exports.addDateEvent = async (req, res, next) => {
  const { eventName, eventDate, eventLocation, eventDescription } = req.body;

  try {
    if (!eventName) errorHandling(`400|Please provide event name.|`);
    if (!eventDate) errorHandling(`400|Please provide event date.|`);
    if (!eventLocation) errorHandling(`400|Please provide event location.|`);
    if (!eventDescription)
      errorHandling(`400|Please provide event description.|`);

    const existingEvent = await DateEvent.findOne({
      eventName,
    });
    if (existingEvent) {
      errorHandling(`401|Event - ${eventName} already exists.|`);
    } else {
      const newEvent = new DateEvent({
        eventName,
        eventDate,
        eventLocation,
        eventDescription,
      });

      await newEvent.save();

      return res.status(200).json({
        statusCode: 200,
        message: 'Success, date event created.',
        data: newEvent,
      });
    }
  } catch (e) {
    next(new Error(e.stack));
  }
};

exports.updateEvent = async (req, res, next) => {
  const user = req.user;
  const eventID = req.query.eventID;
  const { eventName, eventDate, eventLocation, eventDescription } = req.body;
  try {
    if (!user) errorHandling(`400|Not authorized to update date event.|`);
    if (!eventID) errorHandling(`400|Event ID not found.|`);
    else {
      await DateEvent.findOneAndUpdate(
        { _id: eventID },
        {
          eventName,
          eventDate,
          eventLocation,
          eventDescription,
        },
      );

      const updatedDateEvent = await DateEvent.findOne({ _id: eventID });

      res.status(200).json({
        statusCode: 200,
        message: 'Updated date event successfully.',
        data: updatedDateEvent,
      });
    }
  } catch (e) {
    next(new Error(e.stack));
  }
};

exports.deleteAllEvents = async (req, res, next) => {
  const { tag } = req.params;
  try {
    if (!tag || tag !== process.env.TOKEN) {
      errorHandling(`401|You are not HIM.|`);
    } else {
      await DateEvent.deleteMany();
      res.status(200).json({
        statusCode: 200,
        message: 'Successfully killed all extroverts for you.',
      });
    }
  } catch (e) {
    next(new Error(e.stack));
  }
};


const { User } = require('../models/User');

exports.pushNotification = async (userID, description, notificationType) => {
  await User.findByIdAndUpdate(
    userID,
    {
      $push: {
        notifications: {
          description,
          notificationType,
          date: new Date(),
        },
      },
    },
    {
      returnDocument: true,
    },
  );
};


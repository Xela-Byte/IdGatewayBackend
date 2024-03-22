const { uploadFileResponse } = require('../../core/cloudinary');
const { pushNotification } = require('../../core/pushNotification');
const { errorHandling } = require('../../middlewares/errorHandling');
const { User } = require('../../models/User');

exports.updateProfile = async (req, res, next) => {
  try {
    const user = req.user;
    const { userName, birthday, phoneNumber, gender, category, interests } =
      req.body;

    const existingUsername = await User.findOne({ userName });

    if (existingUsername)
      errorHandling(
        `401|Username - ${existingUsername.userName} already exists.|`,
      );
    if (!req.files) {
      await User.findOneAndUpdate(
        { _id: user._id },
        {
          userName,
          gender,
          category,
          interests,
          birthday,
          phoneNumber,
        },
      );
      const updatedUserProfile = await User.findOne({ _id: user._id });
      res.status(200).json({
        statusCode: 200,
        message: 'Profile updated successfully.',
        data: updatedUserProfile,
      });
    } else {
      const cloudinarizedPhoto = await uploadFileResponse(
        req.files.profilePhoto,
      );
      await user.updateOne(
        {
          $push: {
            profilePhoto: {
              date: new Date(),
              link: cloudinarizedPhoto,
            },
          },
          $set: {
            userName,
            gender,
            category,
            interests,
            likes,
          },
        },
        {
          returnDocument: true,
        },
      );
      const updatedUserProfile = await User.findOne({ _id: user._id });
      res.status(200).json({
        statusCode: 200,
        message: 'Profile updated successfully.',
        data: updatedUserProfile,
      });
    }
  } catch (e) {
    next(new Error(e.stack));
  }
};

exports.addUserLike = async (req, res, next) => {
  const user = req.user;
  const { userID, name, age } = req.body;

  try {
    const existingLike = await User.findOne({
      _id: user._id,
      likes: { $elemMatch: { userID } },
    });

    if (existingLike) errorHandling(`400|Like already exists.|`);
    else {
      await user.updateOne(
        {
          $push: {
            likes: {
              userID,
              name,
              age,
            },
          },
        },
        {
          returnDocument: true,
        },
      );
      await pushNotification(userID, 'You got a new like', 'newLike');
      const updatedUserProfile = await User.findOne({ _id: user._id });
      res.status(200).json({
        statusCode: 200,
        message: 'Likes updated successfully.',
        data: updatedUserProfile,
      });
    }
  } catch (e) {
    next(new Error(e.stack));
  }
};

exports.deleteSingleLike = async (req, res, next) => {
  const user = req.user;
  const likeID = req.query.likeID;

  try {
    if (!likeID) errorHandling(`400|Please provide likeID.|`);
    else {
      await user.updateOne(
        { $pull: { likes: { _id: likeID } } },
        {
          returnDocument: true,
        },
      );
      const updatedUserProfile = await User.findOne({ _id: user._id });
      res.status(200).json({
        statusCode: 200,
        message: 'Likes updated successfully.',
        data: updatedUserProfile,
      });
    }
  } catch (e) {
    next(new Error(e.stack));
  }
};

exports.deleteAllLikes = async (req, res, next) => {
  const user = req.user;

  try {
    await user.updateOne(
      {
        $set: {
          likes: [],
        },
      },
      {
        returnDocument: true,
      },
    );
    const updatedUserProfile = await User.findOne({ _id: user._id });
    res.status(200).json({
      statusCode: 200,
      message: 'Likes updated successfully.',
      data: updatedUserProfile,
    });
  } catch (e) {
    next(new Error(e.stack));
  }
};


const { User } = require('../../models/User');
const { errorHandling } = require('../../middlewares/errorHandling');
const { sendMail } = require('../../core/emailService');
const { generateOTP } = require('../../core/otpGenerator');
const moment = require('moment');
const jwt = require('jsonwebtoken');
const { updateToken } = require('../../core/updateToken');

exports.getAllUsers = async (_, res) => {
  let users;

  try {
    users = await User.find();
  } catch (err) {
    console.log(err);
  }
  if (!users) {
    errorHandling(`400|No user found.|`);
  }
  return res.status(200).json({
    statusCode: 200,
    data: users,
  });
};

exports.getSingleUser = async (req, res, next) => {
  const userID = req.query.userID;
  try {
    const userProfile = await User.findOne({ _id: userID });
    res.status(200).json({
      statusCode: 200,
      data: userProfile,
    });
  } catch (e) {
    next(new Error(e.stack));
  }
};

exports.registerUser = async (req, res, next) => {
  const { email } = req.body;
  try {
    if (!email) {
      errorHandling(`400|Please provide email.|`);
    } else {
      const existingUser = await User.findOne({
        email: email,
      });
      if (existingUser) {
        errorHandling(`401|User with email, ${email} already exists.|`);
      } else {
        let otp = generateOTP();
        let otpExpiration = moment().add(15, 'minutes');

        const newUser = new User({
          email: email,
          emailOtp: otp,
          emailOtpExpiration: otpExpiration,
        });

        let data = {
          emailOtp: otp,
        };

        await newUser.save();

        const token = jwt.sign(
          {
            _id: newUser._id,
          },
          process.env.TOKEN,
          {
            expiresIn: '7d',
          },
        );

        await updateToken(newUser._id, token);

        await sendMail('OTP Email Verification', email, 'otp', data)
          .then(() => {
            res.status(200).json({
              statusCode: 200,
              message: 'Success, check your mail for your verification code!',
              data: newUser,
              token: token,
            });
          })
          .catch((e) => {
            next(new Error(e.stack));
          });
      }
    }
  } catch (e) {
    next(new Error(e.stack));
  }
};

exports.loginUser = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      errorHandling(`400|Please provide email.|`);
    } else {
      const existingUser = await User.findOne({ email: email });
      if (!existingUser) {
        errorHandling(`400|User not found.|`);
      } else {
        const token = jwt.sign(
          { email: existingUser.email, _id: existingUser._id },
          process.env.TOKEN,
          {
            expiresIn: '7d',
          },
        );
        await updateToken(existingUser._id, token);
        res.status(200).json({
          statusCode: 200,
          message: 'Login Successful',
          data: existingUser,
          token: token,
        });
      }
    }
  } catch (e) {
    next(new Error(e.stack));
  }
};

exports.verifyUser = async (req, res, next) => {
  const emailOtp = req.query.emailOtp;

  try {
    if (!emailOtp) {
      errorHandling(`400|No otp detected.|`);
    }

    let user = await User.findOne({ emailOtp });

    if (user === null) {
      errorHandling(`400|OTP is Invalid.|`);
    }

    if (user && moment().isAfter(user?.otpExpiration)) {
      errorHandling(`400|OTP has Expired.|`);
    }

    user = await User.findOneAndUpdate(
      {
        emailOtp,
      },
      {
        emailOtp: '',
        emailOtpExpiration: '',
        isEmailVerified: true,
      },
      {
        new: true,
      },
    );

    await sendMail(
      'Welcome to Intercultural Dating!',
      user.email,
      'onboarding',
      {},
    );

    res.status(200).json({
      statusCode: 200,
      message: 'Email Verification Successful',
      data: user,
    });
  } catch (e) {
    next(new Error(e.stack));
  }
};

exports.resendOTP = async (req, res, next) => {
  try {
    const userID = req.query.userID;
    let user = await User.findById(userID);
    if (user === null) {
      errorHandling(`400|User not found.|`);
    }
    let emailOtp = generateOTP();
    let emailOtpExpiration = moment().add(15, 'minutes');
    user = await User.findByIdAndUpdate(
      userID,
      { emailOtp, emailOtpExpiration },
      { new: true },
    );

    await sendMail('New OTP Code', user.email, 'otp', { emailOtp });

    res.status(200).json({
      statusCode: 200,
      message: 'OTP Sent',
      data: user,
    });
  } catch (e) {
    next(new Error(e.stack));
  }
};

exports.deleteAllUsers = async (req, res, next) => {
  const { tag } = req.params;
  try {
    if (!tag || tag !== process.env.TOKEN) {
      errorHandling(`401|You are not HIM.|`);
    } else {
      await User.deleteMany();
      res.status(200).json({
        statusCode: 200,
        message: 'Successfully burnt down the world for you.',
      });
    }
  } catch (e) {
    next(new Error(e.stack));
  }
};


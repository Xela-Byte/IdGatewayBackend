const mongoose = require('mongoose');
const { walletSchema } = require('./Wallet');
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    emailOtp: {
      type: String,
    },
    emailOtpExpiration: {
      type: String,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    phoneNumber: {
      type: String,
      index: true,
      sparse: true,
    },
    profilePhoto: {
      type: Array,
    },
    userName: {
      type: String,
    },
    gender: {
      type: String,
    },
    category: {
      type: String,
    },
    interests: {
      type: Array,
    },
    likes: [
      {
        userID: {
          type: String,
        },
        age: {
          type: String,
        },
        name: {
          type: String,
        },
      },
    ],
    notifications: [
      {
        description: {
          type: String,
        },
        date: {
          type: String,
        },
        notificationType: {
          type: String,
        },
      },
    ],
    wallet: {
      type: walletSchema,
    },
  },
  {
    timestamps: true,
  },
);

const User = mongoose.model('User', userSchema);

module.exports = {
  User: User,
};


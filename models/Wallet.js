const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const walletSchema = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    walletBalance: {
      type: String,
      default: '0',
    },
    loginStreak: {
      type: String,
      default: '0',
    },
    lastStreakDate: {
      type: String,
      default: new Date(),
    },
    transactionHistory: [
      {
        description: {
          type: String,
        },
        date: {
          type: String,
        },
        transactionType: {
          type: String,
        },
        transactionReferenceNumber: {
          type: String,
        },
      },
    ],
  },
  {
    timestamps: true,
  },
);

const Wallet = mongoose.model('Wallet', walletSchema);

module.exports = {
  Wallet: Wallet,
  walletSchema,
};


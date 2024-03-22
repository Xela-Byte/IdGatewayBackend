const { User } = require('../models/User');
const { Wallet } = require('../models/Wallet');

exports.updateWallet = async (
  userID,
  walletID,
  walletBalance,
  loginStreak,
  lastStreakDate,
) => {
  await Wallet.findOneAndUpdate(
    { _id: walletID },
    {
      walletBalance,
      loginStreak,
      lastStreakDate,
    },
  );

  const updatedWallet = await Wallet.findOne({ _id: walletID });

  await User.findOneAndUpdate(
    { _id: userID },
    {
      wallet: updatedWallet,
    },
  );
  const updatedUserWallet = await User.findOne({ _id: userID });

  return updatedUserWallet;
};

exports.updateTransactionHistory = async (
  walletID,
  description,
  transactionType,
  transactionReferenceNumber,
) => {
  const existingWallet = await Wallet.findById(walletID);

  await existingWallet.updateOne(
    {
      $push: {
        transactionHistory: {
          date: new Date(),
          description,
          transactionType,
          transactionReferenceNumber,
        },
      },
    },
    {
      returnDocument: true,
    },
  );
};


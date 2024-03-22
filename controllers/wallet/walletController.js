const {
  updateWallet,
  updateTransactionHistory,
} = require('../../core/updateWallet');
const { errorHandling } = require('../../middlewares/errorHandling');
const { User } = require('../../models/User');
const { Wallet } = require('../../models/Wallet');
const { pushNotification } = require('../../core/pushNotification');
const { generateTXNRefNo } = require('../../core/otpGenerator');

exports.getAllWallets = async (re, res, next) => {
  try {
    const allWallets = await Wallet.find();
    res.status(200).json({
      statusCode: 200,
      message: `Success, retrieved all wallets`,
      data: allWallets,
    });
  } catch (e) {
    next(new Error(e.stack));
  }
};

exports.getSingleWallet = async (req, res, next) => {
  const walletID = req.query.walletID;
  try {
    const walletProfile = await Wallet.findOne({ _id: walletID });
    res.status(200).json({
      message: `Success, retrieved wallet - ${walletProfile._id}`,
      statusCode: 200,
      data: walletProfile,
    });
  } catch (e) {
    next(new Error(e.stack));
  }
};

exports.createUserWallet = async (req, res, next) => {
  const userID = req.query.userID;

  try {
    if (!userID) errorHandling(`400|User ID not detected.|`);

    let existingUser = await User.findById(userID);

    if (!existingUser) errorHandling(`400|User not found.|`);
    if (existingUser.wallet)
      errorHandling(`400|Wallet for ${existingUser.email} found.|`);
    else {
      const newUserWallet = new Wallet({
        owner: userID,
      });

      await newUserWallet.save();

      existingUser = await User.findByIdAndUpdate(
        userID,
        { wallet: newUserWallet },
        { new: true },
      );

      res.status(200).json({
        statusCode: 200,
        message: `Success, Wallet created for ${existingUser.email}.`,
        data: newUserWallet,
      });
    }
  } catch (e) {
    next(new Error(e.stack));
  }
};

exports.updateUserWallet = async (req, res, next) => {
  const userName = req.query.userName;
  const walletID = req.query.walletID;
  const { walletBalance, loginStreak, lastStreakDate } = req.body;
  try {
    if (!userName) errorHandling(`400|User tag not detected.|`);
    if (!walletID) errorHandling(`400|Wallet ID not detected.|`);

    let existingUser = await User.findOne({ userName });
    let existingWallet = await Wallet.findOne({ _id: walletID });
    if (!existingUser) errorHandling(`400|User not found.|`);
    if (!existingWallet) errorHandling(`400|Wallet not found.|`);
    else {
      const updatedUserWallet = await updateWallet(
        existingUser._id,
        walletID,
        walletBalance,
        loginStreak,
        lastStreakDate,
      );

      res.status(200).json({
        statusCode: 200,
        message: `Success, Updated wallet for ${existingUser.email}.`,
        data: updatedUserWallet,
      });
    }
  } catch (e) {
    next(new Error(e.stack));
  }
};

exports.deleteAllWallets = async (req, res, next) => {
  const { tag } = req.params;
  try {
    if (!tag || tag !== process.env.TOKEN) {
      errorHandling(`401|You are not HIM.|`);
    } else {
      await Wallet.deleteMany();
      res.status(200).json({
        statusCode: 200,
        message: 'Successfully made everyone poor for you.',
      });
    }
  } catch (e) {
    next(new Error(e.stack));
  }
};

exports.sendToWallet = async (req, res, next) => {
  const { receiverUserName, senderID, amount } = req.body;

  try {
    if (!receiverUserName) errorHandling(`400|Receiver tag not detected.|`);
    if (!senderID) errorHandling(`400|Sender ID not detected.|`);
    if (!amount) errorHandling(`400|Amount not detected.|`);

    const existingSender = await User.findOne({ _id: senderID });
    const existingReceiver = await User.findOne({ userName: receiverUserName });

    if (!existingSender) errorHandling(`400|Sender details not found.|`);
    if (!existingReceiver) errorHandling(`400|Receiver details not found.|`);
    if (!existingSender.wallet) errorHandling(`400|Sender wallet not found.|`);
    if (!existingReceiver.wallet)
      errorHandling(`400|Receiver wallet not found.|`);
    if (existingSender.userName == existingReceiver.userName)
      errorHandling(`400|You can't send funds to yourself.|`);
    else {
      const senderBalance = existingSender.wallet.walletBalance;

      if (Number(senderBalance) < Number(amount))
        errorHandling(`400|Insufficient Balance.|`);

      const updatedSenderBalance = Number(senderBalance) - Number(amount);
      const receiverBalance = existingReceiver.wallet.walletBalance;
      const updatedReceiverBalance = Number(receiverBalance) + Number(amount);

      const transactionReferenceNumber = generateTXNRefNo();

      await updateTransactionHistory(
        existingSender.wallet._id,
        `User - ${existingReceiver.userName} received ${amount} from you`,
        'debit',
        transactionReferenceNumber,
      );

      const updatedSenderWallet = await updateWallet(
        existingSender._id,
        existingSender.wallet._id,
        updatedSenderBalance,
      );

      await updateTransactionHistory(
        existingReceiver.wallet._id,
        `User - ${existingSender.userName} sent you ${amount}`,
        'credit',
        transactionReferenceNumber,
      );

      await updateWallet(
        existingReceiver._id,
        existingReceiver.wallet._id,
        updatedReceiverBalance,
      );

      await pushNotification(
        existingReceiver._id,
        `User - ${existingSender.userName} sent you ${amount}`,
        'credit',
      );

      res.status(200).json({
        statusCode: 200,
        message: `Transaction successful.`,
        data: updatedSenderWallet.wallet,
      });
    }
  } catch (e) {
    next(new Error(e.stack));
  }
};


'use strict';
const express = require('express');
const router = express.Router();

const {
  registerUser,
  getAllUsers,
  deleteAllUsers,
  verifyUser,
  resendOTP,
  loginUser,
  getSingleUser,
} = require('../controllers/user/userController');

const {
  updateProfile,
  addUserLike,
  deleteSingleLike,
  deleteAllLikes,
} = require('../controllers/profile/profileController');

const { verifyToken } = require('../core/verifyToken');
const {
  getAllEvents,
  addDateEvent,
  getSingleEvent,
  updateEvent,
  deleteAllEvents,
} = require('../controllers/event/eventController');
const {
  createUserWallet,
  updateWalletBalance,
  getAllWallets,
  deleteAllWallets,
  updateUserWallet,
  sendToWallet,
  getSingleWallet,
} = require('../controllers/wallet/walletController');

// Authentications
router.get('/auth/getAllUsers', getAllUsers);
router.get('/auth/getSingleUser', getSingleUser);
router.post('/auth/registerUser', registerUser);
router.post('/auth/loginUser', loginUser);
router.post('/auth/verifyUser', verifyUser);
router.post('/auth/resendOtp', resendOTP);
router.delete('/auth/deleteAllUsers/:tag', deleteAllUsers);
router.patch('/auth/updateProfile', verifyToken, updateProfile);
router.post('/auth/addUserLike', verifyToken, addUserLike);
router.delete('/auth/deleteUserLike', verifyToken, deleteSingleLike);
router.delete('/auth/deleteAllUserLikes', verifyToken, deleteAllLikes);

// Events
router.get('/events/getAllEvents', getAllEvents);
router.get('/events/getSingleEvent', getSingleEvent);
router.post('/events/addEvent', addDateEvent);
router.patch('/events/updateEvent', verifyToken, updateEvent);
router.delete('/events/deleteAllEvents/:tag', deleteAllEvents);

// Wallet
router.get('/wallet/getAllWallets', getAllWallets);
router.get('/auth/getSingleWallet', getSingleWallet);
router.post('/wallet/createUserWallet', createUserWallet);
router.patch('/wallet/updateUserWallet', updateUserWallet);
router.delete('/wallet/deleteAllWallets/:tag', deleteAllWallets);
router.post('/wallet/sendToWallet', sendToWallet);

module.exports = router;


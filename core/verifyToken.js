const jwt = require('jsonwebtoken');
const { User } = require('../models/User');
const { errorHandling } = require('../middlewares/errorHandling');
require('dotenv').config();

exports.verifyToken = async (req, res, next) => {
  try {
    const token =
      req.headers.authorization ||
      req.body.token ||
      req.params.token ||
      req.query.token;

    if (!token) errorHandling(`401|Token not found.|`);
    else {
      await jwt.verify(token, process.env.TOKEN, async function (err, decoded) {
        const key = decoded._id;
        const user = await User.findById(key);
        if (!user) {
          errorHandling(`400|User not found.|`);
        }
        req.user = user;
      });
      next();
    }
  } catch (e) {
    next(new Error(e.stack));
  }
};

exports.updateToken = async (id, key) => {
  try {
    await User.findByIdAndUpdate(id, {
      token: key,
    });
    return true;
  } catch (e) {
    next(new Error(e.stack));
  }
};


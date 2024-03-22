const generateOTP = () => {
  let otp = '';
  for (let i = 0; i < 6; i++) {
    otp += Math.floor(Math.random() * 10).toString();
  }
  return otp;
};

const generateTXNRefNo = () => {
  let refNo = '';
  for (let i = 0; i < 20; i++) {
    refNo += Math.floor(Math.random() * 10).toString();
  }
  return refNo;
};

module.exports = {
  generateOTP,
  generateTXNRefNo,
};


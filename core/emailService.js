const { createTransport } = require('nodemailer');

// Load Email Templates
const { welcomeEmailTemplate } = require('../templates/onboarding.template');
const { otpEmailTemplate } = require('../templates/otp.template');
const {
  passwordResetTemplate,
} = require('../templates/passwordReset.template');

// For Gmail
const options = {
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASS,
  },
};

transporter = createTransport(options);

const sendMail = async (subject, email, type, data) => {
  html = '';

  if (type === 'onboarding') {
    html = welcomeEmailTemplate();
  }
  if (type === 'otp') {
    html = otpEmailTemplate(`${data.emailOtp}`);
  }
  if (type === 'password-reset') {
    html = passwordResetTemplate(`${data.userName}`);
  }
  const mailOptions = {
    from: `Intercultural Dating ${process.env.EMAIL_USERNAME}`,
    to: `${email}`,
    subject: subject,
    html: html,
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

module.exports = {
  sendMail,
};


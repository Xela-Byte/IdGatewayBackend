const passwordResetTemplate = (name) => {
  const html = `
  <!DOCTYPE html>
<html>
<head>
    <title>Password Reset Notification</title>
    <style>
        body {
            font-family: Nunito, sans-serif;
        }
        .header {
            background-color: #E1510F;
            padding: 20px;
            text-align: center;
        }
        .content {
            padding: 20px;
        }
        .footer {
            background-color: #E1510F;
            padding: 10px;
            text-align: center;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Password Reset</h1>
    </div>
    <div class="content">
        <p>Dear ${name},</p>
        <p>Your password was resetted successfully!</p>
        <p>If you didn't make this action, feel free to reach out to us.</p>
        <p>Best regards,</p>
        <p>Intercultural Dating Team.</p>
    </div>
    <div class="footer">
        <p>Intercultural Dating</p>
    </div>
</body>
</html>
  `;

  return html;
};

module.exports = {
  passwordResetTemplate,
};


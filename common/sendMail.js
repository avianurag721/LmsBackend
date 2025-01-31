const nodemailer = require('nodemailer');

const sendEmail = async (recipient, subject, message) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: {
        rejectUnauthorized: false, // Ignore certificate validation errors
      },
    });

    const mailOptions = {
      from: process.env.SMTP_USER,
      to: recipient,
      subject: subject,
      text: message,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

module.exports = sendEmail;

const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, htmlContent) => {
  try {
    console.log("ENV:", process.env.EMAIL_USER, process.env.EMAIL_PASS);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    await transporter.sendMail({
      from: `"Karmaas Store 🛒" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html: htmlContent   // ✅ IMPORTANT CHANGE
    });

    console.log("Email sent ✅");

  } catch (err) {
    console.error("Email failed ❌", err.message);
  }
};

module.exports = sendEmail;
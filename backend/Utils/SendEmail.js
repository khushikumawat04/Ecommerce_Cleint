// const nodemailer = require("nodemailer");

// const SendEmail = async (to, subject, htmlContent) => {
//   try {
//     console.log("ENV:", process.env.EMAIL_USER, process.env.EMAIL_PASS);

//     const transporter = nodemailer.createTransport({
//       service: "gmail",
//       auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS
//       }
//     });

//     await transporter.sendMail({
//       from: `"Karmaas Store 🛒" <${process.env.EMAIL_USER}>`,
//       to,
//       subject,
//       html: htmlContent   // ✅ IMPORTANT CHANGE
//     });

//     console.log("Email sent ✅");

//   } catch (err) {
//     console.error("Email failed ❌", err.message);
//   }
// };

// module.exports = SendEmail;

const SibApiV3Sdk = require("sib-api-v3-sdk");
const axios = require("axios");

const client = SibApiV3Sdk.ApiClient.instance;

const apiKey = client.authentications["api-key"];
apiKey.apiKey = process.env.BREVO_API_KEY;

const tranEmailApi = new SibApiV3Sdk.TransactionalEmailsApi();

const SendEmail = async (to, subject, htmlContent) => {
  try {

    await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: {
          email: process.env.BREVO_SENDER_EMAIL,
          name: "Karmaass"
        },
        to: [{ email: to }],
        subject: subject,
        htmlContent: htmlContent
      },
      {
        headers: {
          "api-key": process.env.BREVO_API_KEY,
          "Content-Type": "application/json"
        }
      }
    );

    console.log("✅ Email sent to", to);

  } catch (error) {
    console.log("❌ FULL ERROR:", error.response?.data || error.message);
  }
};

module.exports = SendEmail;
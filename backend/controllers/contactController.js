const Contact = require("../models/Contact");
const nodemailer = require("nodemailer");

// exports.sendMessage = async (req, res) => {
//   try {
//     const { name, email, phone, message, hidden } = req.body;

//     // Anti-spam (honeypot)
//     if (hidden) {
//       return res.status(400).json({ error: "Spam detected" });
//     }

//     // Save to DB
//     await Contact.create({ name, email, phone, message });

//     // Send Email
//     const transporter = nodemailer.createTransport({
//       service: "gmail",
//       auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS,
//       },
//     });

//     await transporter.sendMail({
//       from: email,
//       to: process.env.EMAIL_USER,
//       subject: "New Contact Message",
//       text: `
//         Name: ${name}
//         Email: ${email}
//         Phone: ${phone}
//         Message: ${message}
//       `,
//     });

//     res.status(200).json({ success: true });

//   } catch (err) {
//     res.status(500).json({ error: "Server Error" });
//   }
// };

exports.sendMessage = async (req, res) => {
  try {
    console.log("BODY:", req.body); // 👈 add this

    const { name, email, phone, message, hidden } = req.body;

    if (hidden) {
      return res.status(400).json({ error: "Spam detected" });
    }

    await Contact.create({ name, email, phone, message });

    res.status(200).json({ success: true });

  } catch (err) {
    console.log("ERROR:", err); // 👈 VERY IMPORTANT
    res.status(500).json({ error: "Server Error" });
  }
};
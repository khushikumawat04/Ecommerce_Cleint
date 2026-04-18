const Contact = require("../models/Contact");
const nodemailer = require("nodemailer");

exports.sendMessage = async (req, res) => {
  try {
    const { name, email, phone, message, hidden } = req.body;

    // Anti-spam (honeypot)
    if (hidden) {
      return res.status(400).json({ error: "Spam detected" });
    }

    // Save to DB
    await Contact.create({ name, email, phone, message });

    // Send Email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

   await transporter.sendMail({
  from: `"Karmaass Store" <${process.env.EMAIL_USER}>`,
  to: process.env.EMAIL_USER,

  subject: `🛒 New Customer Inquiry | Karmaass Store`,

  html: `
    <div style="font-family: Arial, sans-serif; background:#f4f4f4; padding:20px;">
      
      <div style="max-width:600px; margin:auto; background:#ffffff; border-radius:10px; overflow:hidden; box-shadow:0 4px 10px rgba(0,0,0,0.1);">
        
        <!-- Header -->
        <div style="background:#00C853; color:#fff; padding:15px; text-align:center;">
          <h2 style="margin:0;">Karmaass Ecommerce</h2>
          <p style="margin:0; font-size:14px;">New Customer Inquiry</p>
        </div>

        <!-- Body -->
        <div style="padding:20px; color:#333;">
          
          <p>You have received a new message from your website contact form:</p>

          <table style="width:100%; border-collapse:collapse; margin-top:15px;">
            <tr>
              <td style="padding:8px; font-weight:bold;">Name:</td>
              <td style="padding:8px;">${name}</td>
            </tr>
            <tr>
              <td style="padding:8px; font-weight:bold;">Email:</td>
              <td style="padding:8px;">${email}</td>
            </tr>
            <tr>
              <td style="padding:8px; font-weight:bold;">Phone:</td>
              <td style="padding:8px;">${phone}</td>
            </tr>
            <tr>
              <td style="padding:8px; font-weight:bold;">Message:</td>
              <td style="padding:8px;">${message}</td>
            </tr>
          </table>

        </div>

        <!-- Footer -->
        <div style="background:#f1f1f1; padding:15px; text-align:center; font-size:12px; color:#777;">
          <p style="margin:0;">Karmaass Ecommerce Store</p>
          <p style="margin:0;">Customer Support System</p>
        </div>

      </div>
    </div>
  `,
});
    res.status(200).json({ success: true });

  } catch (err) {
    res.status(500).json({ error: "Server Error" });
  }
};

// exports.sendMessage = async (req, res) => {
//   try {
//     console.log("BODY:", req.body); // 👈 add this

//     const { name, email, phone, message, hidden } = req.body;

//     if (hidden) {
//       return res.status(400).json({ error: "Spam detected" });
//     }

//     await Contact.create({ name, email, phone, message });

//     res.status(200).json({ success: true });

//   } catch (err) {
//     console.log("ERROR:", err); // 👈 VERY IMPORTANT
//     res.status(500).json({ error: "Server Error" });
//   }
// };
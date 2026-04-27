const Contact = require("../models/Contact");
const nodemailer = require("nodemailer");


const sendEmail = require("../utils/sendEmail");

exports.sendMessage = async (req,res)=>{
try{

const {name,email,phone,message,hidden}=req.body;

// Honeypot spam check
if(hidden){
return res.status(400).json({
error:"Spam detected"
});
}

// Save message
await Contact.create({
name,
email,
phone,
message
});


// reuse same email utility like order confirmation
await sendEmail(
process.env.EMAIL_USER,
"📩 New Customer Inquiry | Karmaas",
`
<div style="font-family:Arial;background:#F1F1F1;padding:20px;">

<div style="max-width:600px;margin:auto;background:#fff;border-radius:12px;overflow:hidden;">

<div style="background:#00C853;color:#fff;padding:20px;text-align:center;">
<h2>Karmaas 🌿</h2>
<p>New Contact Form Message</p>
</div>

<div style="padding:20px;color:#212121;">

<p>You received a new customer inquiry:</p>

<table style="width:100%;border-collapse:collapse;">
<tr>
<td style="padding:10px;"><b>Name:</b></td>
<td>${name}</td>
</tr>

<tr>
<td style="padding:10px;"><b>Email:</b></td>
<td>${email}</td>
</tr>

<tr>
<td style="padding:10px;"><b>Phone:</b></td>
<td>${phone}</td>
</tr>

<tr>
<td style="padding:10px;"><b>Message:</b></td>
<td>${message}</td>
</tr>
</table>

<div style="margin-top:25px;">
<a href="mailto:${email}"
style="
background:#00C853;
color:#fff;
padding:12px 18px;
text-decoration:none;
border-radius:6px;">
Reply to Customer
</a>
</div>

</div>

<div style="background:#fafafa;padding:15px;text-align:center;font-size:12px;">
Customer Support Notification
</div>

</div>
</div>
`
);

res.status(200).json({
success:true,
message:"Message sent successfully"
});

}catch(err){
console.error("Contact Error:",err);
res.status(500).json({
error:err.message
});
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
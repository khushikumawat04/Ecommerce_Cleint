const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const adminRoutes = require("./routes/adminRoutes");
const passport = require("./config/passport");
const contectRoutes = require("./routes/contactRoutes");  
const offerRoutes = require("./routes/offerRoutes");
const sendEmail = require("./Utils/SendEmail");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");

require("./cron/cleanupOrders"); // Start the cleanup cron job
require("./cron/shiprocketSyncCron"); // Start the Shiprocket sync cron job
dotenv.config();
connectDB();


const app = express();
app.set("trust proxy", 1);
app.use(helmet());
// ======================
// 1. CORS FIRST
// ======================
app.use(cors());

// ======================
// 2. WEBHOOK RAW BODY (MUST COME BEFORE express.json)
// ======================
app.use(
"/api/payment/webhook",
express.raw({ type: "application/json" })
);



// ======================
// 3. NORMAL BODY PARSING
// ======================
app.use(express.json());

// ======================
// 4. SESSION (if needed)
// ======================
app.use(
  require("express-session")({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());




const apilimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 100, // max requests per IP
  message: "Too many requests, please try again later."
});
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: "Too many login attempts, try again later."
});
app.use("/api", apilimiter);
app.use("/api/auth/login", loginLimiter);
// Test Route
app.get("/", (req, res) => {
  res.send("API is running...");
});
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payment", paymentRoutes);

app.use("/api/admin", adminRoutes);
app.use("/api/contact", contectRoutes);
app.use("/api/offers", offerRoutes);

app.get("/test-email", async (req,res)=>{
  await sendEmail(
    "kkhushikumawat04@gmail.com",
    "Test Email 🚀",
    "<h1>Working perfectly!</h1>"
  );

  res.send("Email triggered");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
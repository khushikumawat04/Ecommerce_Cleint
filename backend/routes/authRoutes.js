// const express = require("express");
const dotenv = require("dotenv");

const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const router = express.Router();
const { register, login, createAdmin } = require("../controllers/authController");
const protect = require("../middleware/authMiddleware");
const User = require("../models/User"); 

router.post("/register", register);
router.post("/login", login);






// STEP 1: Google Login
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// STEP 2: Callback
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    const user = req.user;

    const token = jwt.sign(
      { _id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

   const userData = encodeURIComponent(
  JSON.stringify({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role
  })
);

res.redirect(
  `https://karmaass.com/google-success?token=${token}&user=${userData}`
);
  }
);

// routes/user.js
router.get("/profile", protect, async (req, res) => {
  const user = await User.findById(req.user._id);
  res.json(user);
});

router.post("/address", protect, async (req, res) => {
  const user = await User.findById(req.user._id);

  user.addresses.push(req.body);
  await user.save();

  res.json(user);
});

router.delete("/address/:id", protect, async (req, res) => {
  const user = await User.findById(req.user._id);

  user.addresses = user.addresses.filter(
    addr => addr._id.toString() !== req.params.id
  );

  await user.save();

  res.json(user);
});



module.exports = router;
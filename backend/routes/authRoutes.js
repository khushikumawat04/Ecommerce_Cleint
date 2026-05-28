const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");

const router = express.Router();

const {
  register,
  login,
  changePassword,
} = require("../controllers/authController");

const protect = require("../middleware/authMiddleware");
const User = require("../models/User");

/* =========================
   AUTH ROUTES
========================= */

router.post("/register", register);
router.post("/login", login);

/* =========================
   GOOGLE AUTH
========================= */

// STEP 1: Redirect to Google
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

// STEP 2: Google callback
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    try {
      const user = req.user;

      const token = jwt.sign(
        {
          _id: user._id,
          role: user.role,
        },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      const userData = {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      };

      // safer encoding (avoid huge URL issues)
      const encodedUser = encodeURIComponent(JSON.stringify(userData));

      return res.redirect(
        `https://karmaass.com/google-success?token=${token}&user=${encodedUser}`
      );
    } catch (err) {
      console.error("Google Callback Error:", err);
      return res.redirect("https://karmaass.com/login-failed");
    }
  }
);

/* =========================
   USER PROFILE
========================= */

router.get("/profile", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    return res.json({
      success: true,
      user,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

/* =========================
   ADDRESS MANAGEMENT
========================= */

// Add address
router.post("/address", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    user.addresses.push(req.body);
    await user.save();

    return res.json({
      success: true,
      addresses: user.addresses,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// Delete address
router.delete("/address/:id", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    user.addresses = user.addresses.filter(
      (addr) => addr._id.toString() !== req.params.id
    );

    await user.save();

    return res.json({
      success: true,
      addresses: user.addresses,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

/* =========================
   CHANGE PASSWORD
========================= */

router.put("/change-password", protect, changePassword);

module.exports = router;
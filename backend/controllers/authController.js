const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// 🔐 GENERATE TOKEN
const generateToken = (user) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is missing in .env");
  }

  return jwt.sign(
    { _id: user._id },
    process.env.JWT_SECRET, // ✅ direct use (FIXED)
    { expiresIn: "7d" }
  );
};

// 📝 REGISTER
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    const emailRegex = /^\S+@\S+\.\S+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format"
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters"
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check existing user
    const existingUser = await User.findOne({
      email: normalizedEmail
    });

    if (existingUser) {

      // If user exists via Google
      if (existingUser.provider === "google") {
        return res.status(400).json({
          success: false,
          message:
            "This email is registered using Google Sign-In. Please login with Google."
        });
      }

      return res.status(400).json({
        success: false,
        message: "User already exists"
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      name,
      email: normalizedEmail,
      password: hashedPassword,
      provider: "local"
    });

    const token = generateToken(user);

    return res.status(201).json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Server error. Please try again later."
    });
  }
};
// LOGIN
exports.login = async (req, res) => {
  try {

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success:false,
        message:"Email and password are required"
      });
    }

    const emailRegex = /^\S+@\S+\.\S+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success:false,
        message:"Invalid email format"
      });
    }

    const user = await User.findOne({
      email: email.toLowerCase().trim()
    });
    // console.log("User found:", user); // 👈 add this

    if (!user) {
      return res.status(404).json({
        success:false,
        message:"User not found"
      });
    }

    // Google account trying password login
    if (
      user.provider === "google" ||
      !user.password
    ) {
      return res.status(400).json({
        success:false,
        message:
          "This account uses Google Sign-In. Continue with Google."
      });
    }

    let isMatch = false;

    try {
      isMatch = await bcrypt.compare(
        password,
        user.password
      );
    } catch (error) {
      return res.status(400).json({
        success:false,
        message:"Invalid account password setup"
      });
    }

    if (!isMatch) {
      return res.status(401).json({
        success:false,
        message:"Invalid password"
      });
    }

    const token = jwt.sign(
      {
        _id: user._id,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn:"7d" }
    );

    return res.status(200).json({
      success:true,
      token,
      user: {
    _id: user._id,
    name: user.name,   // 🔥 ADD THIS
    email: user.email,
    role: user.role
  }
    });

  } catch(err) {
    console.error(err);

    return res.status(500).json({
      success:false,
      message:"Server error. Please try again later."
    });
  }
};


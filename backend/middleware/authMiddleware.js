const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
  try {
    let token = req.headers.authorization;

    console.log("HEADER:", token); // 🔥 DEBUG

    if (!token) {
      return res.status(401).json({ message: "No token ❌" });
    }

    // ✅ Remove "Bearer"
    if (token.startsWith("Bearer")) {
      token = token.split(" ")[1];
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log("DECODED:", decoded); // 🔥 DEBUG

    req.user = decoded; // ✅ VERY IMPORTANT

    next();

  } catch (err) {
    console.log("AUTH ERROR:", err.message);
    return res.status(401).json({ message: "Unauthorized ❌" });
  }
};

module.exports = protect;


exports.adminMiddleware = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin only" });
  }
  next();
};

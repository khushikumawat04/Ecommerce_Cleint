const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "https://ecommerce-cleint.onrender.com/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // ✅ Get user email
        const userEmail = profile.emails[0].value;

        // 🔍 Check user by EMAIL (IMPORTANT)
        let user = await User.findOne({ email: userEmail });

        if (user) {
          // 👉 Existing user → LOGIN

          // Link Google if not linked
          if (!user.googleId) {
            user.googleId = profile.id;
            user.avatar = profile.photos[0].value;
            await user.save();
          }

        } else {
          // 👉 New user → SIGNUP

          user = await User.create({
            googleId: profile.id,
            name: profile.displayName,
            email: userEmail,
            avatar: profile.photos[0].value,
          });
        }

        return done(null, user);

      } catch (err) {
        return done(err, null);
      }
    }
  )
);

module.exports = passport;


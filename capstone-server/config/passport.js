import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { ExtractJwt, Strategy as JwtStrategy } from "passport-jwt";
import { Strategy as GoogleStrategy } from "passport-google-oauth2";
import bcrypt from "bcrypt";
import User from "../models/users.model.js";
import dotenv from "dotenv";
dotenv.config();

const config = {
  usernameField: "email",
  passwordField: "password",
};

passport.use(
  new LocalStrategy(
    { usernameField: "email" }, // use email for login
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email });
        if (!user) return done(null, false, { message: "User not found" });
        const match = await bcrypt.compare(password, user.password);
        if (!match) return done(null, false, { message: "Incorrect password" });
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

const jwtOption = {
  jwtFromRequest: ExtractJwt.fromExtractors([
    (req) => req.cookies.token || null,
  ]),
  secretOrKey: process.env.JWT_SECRET_KEY,
};

passport.use(
  "jwt",
  new JwtStrategy(jwtOption, async (jwt_payload, done) => {
    try {
      console.log("JWT payload:", jwt_payload);
      const foundUser = await User.findById(jwt_payload.userId);
      if (!foundUser) {
        console.log("No user found with ID:", jwt_payload.userId);
        return done(null, false, { message: "User not found" });
      }
      console.log("Found user:", foundUser.email);
      return done(null, foundUser);
    } catch (err) {
      console.error("Error in JWT strategy:", err);
      return done(err, false);
    }
  })
);

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      // CORRECTED: The URL should match your route exactly. Your route is /auth/google/callback, not /auth/login/google/callback.
      callbackURL: "http://localhost:5000/auth/google/callback",
      // ADD THIS LINE: Explicitly define the scope here.
      scope: ["profile", "email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // ... your existing verify callback logic ...
        let user = await User.findOne({ email: profile.emails[0].value });
        if (!user) {
          user = await User.create({
            username: profile.displayName,
            email: profile.emails[0].value,
          });
        }
        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

export default passport;

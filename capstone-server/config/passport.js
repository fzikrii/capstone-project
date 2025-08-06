import passport from 'passport'
import { Strategy as LocalStrategy } from "passport-local"
import { ExtractJwt, Strategy as JwtStrategy } from "passport-jwt"
import { Strategy as GoogleStrategy } from 'passport-google-oauth2'
import bcrypt from "bcrypt"
import User from '../models/users.model.js'
import dotenv from 'dotenv'
dotenv.config()


const config = {
    usernameField: "email",
    passwordField: "password"
}

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
        (req) => req.cookies.token || null
    ]),
    secretOrKey: process.env.JWT_SECRET_KEY
}
const googleOption = {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_SECRET,
    callbackURL: 'http://localhost:5000/auth/login/google/callback'
}

passport.use(
    "jwt",
    new JwtStrategy(jwtOption, async(user, done) => {
        console.log('asdasd')
        const foundUser = await User.findById(user._id);
        if (!foundUser)
            return done(null, false, { message: "User not found" })
        done(null, foundUser)
    })
)

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/login/google/callback"
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Find user by Google ID or email
      let user = await User.findOne({ email: profile.emails[0].value });
      if (!user) {
        user = await User.create({
          username: profile.displayName,
          email: profile.emails[0].value,
          // No password for Google users
        });
      }
      return done(null, user);
    } catch (err) {
      return done(err, null);
    }
  }
));

export default passport
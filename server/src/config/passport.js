import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { User } from "../models/user.js";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.BACKEND_URL}/api/v1/auth/google/callback`,
    },

    async (accessToken, refreshToken, profile, done) => {
      try {

        const email = profile.emails[0].value;
        let avatar = profile.photos?.[0]?.value;
        // fix google avatar size
        if (avatar && avatar.includes("googleusercontent")) {
            avatar = avatar.replace(/=s\d+(-c)?$/, "=s400-c");
        }

        let user = await User.findOne({ email });

        if (!user) {
            user = await User.create({
                fullName: profile.displayName,
                email,
                googleId: profile.id,
                avatar,
                provider: "google"
            });
        }
        else if (!user.googleId) {
            user.googleId = profile.id
            user.provider = "google"
            if (!user.avatar) {
                user.avatar = avatar;
            }
            await user.save()
        }

        return done(null, user);

      } catch (error) {
        return done(error, null);
      }
    }
  )
);
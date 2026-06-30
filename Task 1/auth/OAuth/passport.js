const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const { queryDatabase } = require("../../db.js");
const CustomError = require("../../utils/CustomError.js");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },

    async (accessToken, refreshToken, profile, done) => {
      try {
        const full_name = profile.displayName;
        const email = profile.emails?.[0]?.value;

        if (!email) {
          return done(new Error("Email not found from Google"));
        }

        // Check existing user

        const existingUsers = await queryDatabase(
          "SELECT * FROM users WHERE email = ?",
          [email],
        );

        //if Existing User then Login

        if (existingUsers.length > 0) {
          return done(null, existingUsers[0]);
        }

        // if New User then Create Participant account and Login

        const result = await queryDatabase(
          `
INSERT INTO users
(
  full_name,
  email,
  password,
  role,  
  provider
)
VALUES
(
  ?,
  ?,
  NULL,
  'participant',
  'google'
)
`,
          [full_name, email],
        );
        
        const newUser = {
          id: result.insertId,
          full_name,
          email,
          role: "participant",
          provider: "google",
        };

        return done(null, newUser);
      } catch (error) {
        return done(error);
      }
    },
  ),
);

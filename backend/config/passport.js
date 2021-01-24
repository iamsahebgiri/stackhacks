var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var mongoose = require("mongoose");
var User = mongoose.model("User");

passport.use(
  new LocalStrategy(
    {
      usernameField: "user[email]",
      passwordField: "user[password]",
    },
    (email, password, done) => {
      User.findOne({ email: email })
        .then(function (user) {
          if (!user) {
            return done(null, false, {
              errors: { email: `email ${email} not found.` },
            });
          }
          if (!user.password) {
            return done(null, false, {
              errors: {
                password:
                  "Your account was registered using a sign-in provider. To enable password login, sign in using a provider, and then set a password under your user profile.",
              },
            });
          }
          user.comparePassword(password, (err, isMatch) => {
            if (err) {
              return done(err);
            }
            if (isMatch) {
              return done(null, user);
            }
            return done(null, false, {
              errors: { "email or password": "invalid email or password." },
            });
          });
        })
        .catch(done);
    }
  )
);

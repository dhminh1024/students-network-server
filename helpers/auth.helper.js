const {
  oauthConfig: { googleAuth, facebookAuth },
  isOauthConfig: { isGoogleAuth, isFacebookAuth },
} = require("../config/keys");

module.exports = (passport) => {
  passport.serializeUser((user, done) => {
    done(null, user);
  });
  passport.deserializeUser((user, done) => {
    done(null, user);
  });
  if (isGoogleAuth) {
  }
  if (isFacebookAuth) {
  }
};

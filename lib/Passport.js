const passport = require('koa-passport');
const FacebookStrategy = require('passport-facebook').Strategy;

const config = require('config').server.facebook;

const UserLib = require('./ReportUser');

passport.use(new FacebookStrategy({
  clientID: config.appId,
  clientSecret: config.appSecret,
  callbackURL: config.callbackUrl,
  //profileFields: config.profileFields,
}, (accessToken, refreshToken, profile, done) => {
  return done(null, accessToken); 
}));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

module.exports = passport;

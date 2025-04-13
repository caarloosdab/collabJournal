// app.js
const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const session = require('express-session');
const GitHubStrategy = require('passport-github2').Strategy;
const cors = require('cors');
const dotenv = require("dotenv").config();
const MongoStore = require('connect-mongo');

const app = express();

app
  .use(bodyParser.json())
  .use(session({
      secret: "secret",
      resave: false,
      saveUninitialized: true
  }))
  .use(passport.initialize())
  .use(passport.session())
  .use((req, res, next) => {
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader(
          "Access-Control-Allow-Headers", 
          "Origin, X-Requested-With, Content-Type, Accept, Z-key, Authorization"
      );
      res.setHeader(
          'Access-Control-Allow-Methods', 
          'GET, POST, OPTIONS, PUT, PATCH, DELETE'
      );
      next();
  })
  .use(cors({ methods: ['GET', 'POST','DELETE','UPDATE' ,'PUT', 'PATCH'] }))
  .use('/', require('./routes/index.js'));

// GitHub OAuth strategy
passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: process.env.GITHUB_CALLBACK_URL
}, (accessToken, refreshToken, profile, done) => {
  return done(null, profile);
}));

passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((user, done) => {
  done(null, user);
});

// Auth route
app.get('/', (req, res) => {
  res.send(req.session.user !== undefined 
    ? `logged in as ${req.session.user.displayName}` 
    : "Logged Out");
});

app.get('/github/callback', passport.authenticate('github', {
  failureRedirect: '/api-docs'
}), (req, res) => {
  req.session.user = req.user;
  res.redirect('/');
});

module.exports = app;

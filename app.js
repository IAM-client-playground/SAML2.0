const express = require("express");
const session = require("express-session");
const passport = require("passport");
const SamlStrategy = require("passport-saml").Strategy;

const app = express();

// Configure session management
app.use(
  session({
    secret: "secret", // Replace with a strong secret
    resave: false,
    saveUninitialized: true,
  })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Passport session setup
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

// Configure the SAML strategy
passport.use(
  new SamlStrategy(
    {
      // SAML strategy options here
      // Example:
      entryPoint: "https://your-idp-entry-point/",
      issuer: "your-app-entity-id",
      callbackUrl: "http://localhost:3000/login/callback",
    },
    (profile, done) => {
      // Here you can use the profile to associate with a user record in your database
      return done(null, profile);
    }
  )
);

// Routes
app.get("/", (req, res) => {
  res.send("Home Page");
});

app.get(
  "/login",
  passport.authenticate("saml", {failureRedirect: "/", failureFlash: true}),
  (req, res) => {
    res.redirect("/");
  }
);

app.post(
  "/login/callback",
  passport.authenticate("saml", {failureRedirect: "/", failureFlash: true}),
  (req, res) => {
    // Display the SAML assertion
    res.send(`<pre>${JSON.stringify(req.user, null, 2)}</pre>`);
  }
);

// Start the server
app.listen(3000, () => {
  console.log("Server started on http://localhost:3000");
});

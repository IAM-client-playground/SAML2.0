const express = require("express");
const session = require("express-session");
const passport = require("passport");
const formRoute = require("./HTMLFormAuthRoute");
const mfaRoute = require("./MFAAuthRoute");

const app = express();

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));
// Session configuration
app.use(
  session({
    secret: "very secret string", // Replace with a real secret in production
    resave: false,
    saveUninitialized: true,
    cookie: {secure: false}, // For HTTPS: set to true
  })
);

// Initialize Passport and session handling for Passport
app.use(passport.initialize());
app.use(passport.session());

// Use routers
app.use("/form", authRouter);
app.use("/mfa", mfaRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

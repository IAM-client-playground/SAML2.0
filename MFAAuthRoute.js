const express = require("express");
const passport = require("passport");
const SamlStrategy = require("passport-saml").Strategy;
const router = express.Router();

passport.use(
  "samlStrategy2",
  new SamlStrategy(
    {
      // SAML strategy configuration for IDP 1
      // ...
    },
    (profile, done) => done(null, profile)
  )
);

router.get(
  "/login",
  passport.authenticate("samlStrategy2", {
    failureRedirect: "/",
    failureFlash: true,
  })
);
router.post(
  "/login/callback",
  passport.authenticate("samlStrategy2", {
    failureRedirect: "/",
    failureFlash: true,
  }),
  (req, res) => res.redirect("/user")
);

module.exports = router;

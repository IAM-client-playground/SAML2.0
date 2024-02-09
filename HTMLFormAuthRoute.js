const express = require("express");
const passport = require("passport");
const SamlStrategy = require("passport-saml").Strategy;
const router = express.Router();

passport.use(
  "samlStrategy1",
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
  passport.authenticate("samlStrategy1", {
    failureRedirect: "/",
    failureFlash: true,
  })
);
router.post(
  "/login/callback",
  passport.authenticate("samlStrategy1", {
    failureRedirect: "/",
    failureFlash: true,
  }),
  (req, res) => res.redirect("/user")
);

router.get("/logout", (req, res) => {
  req.logout();
  // Additional logic to handle the SAML logout request
  req.user = null;

  samlStrategy.logout(req, (err, url) => {
    if (err) {
      // Handle logout error
      res.status(500).send(err);
    } else {
      // Redirect to the IdP's logout URL
      res.redirect(url);
    }
  });
});

router.post("/logout/callback", (req, res) => {
  // Additional logic to handle the SAML logout response
  samlStrategy.logoutCallback(req, (err, user) => {
    if (err) {
      // Handle logout error
      res.status(500).send(err);
    } else {
      // Redirect to the IdP's logout response URL
      res.redirect("/logout");
    }
  });
});

module.exports = router;

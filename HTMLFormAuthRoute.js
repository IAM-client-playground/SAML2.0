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
router.post("/login/callback", (req, res) => {
  const assertionData = JSON.stringify(req.user, null, 2); // Format the user object for display

  // Read the HTML file
  const filePath = path.join(__dirname, "views", "assertionPage.html");
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading the file:", err);
      return res.status(500).send("An error occurred");
    }

    // Replace the placeholder with actual assertion data
    const result = data.replace("{{assertionData}}", assertionData);
    result = result.replace("{{application}}", "SAML Application 1");
    // Send the modified HTML to the client
    res.send(result);
  });
});
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

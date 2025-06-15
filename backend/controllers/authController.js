const { google } = require("googleapis");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);
console.log("GOOGLE_CLIENT_ID:", process.env.GOOGLE_CLIENT_ID);

const SCOPES = [
  "https://www.googleapis.com/auth/userinfo.email",
  "https://www.googleapis.com/auth/userinfo.profile",
  "https://www.googleapis.com/auth/youtube",
];

// Step 1: Redirect to Google OAuth
exports.login = (req, res) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: SCOPES,
    client_id:process.env.GOOGLE_CLIENT_ID,
    redirect_uri:process.env.GOOGLE_REDIRECT_URI
  });
  res.redirect(url);
};

// Step 2: Handle callback from Google
exports.googleCallback = async (req, res) => {
  const { code } = req.query;

  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    // Get user info
    const oauth2 = google.oauth2({ auth: oauth2Client, version: "v2" });
    const { data: userInfo } = await oauth2.userinfo.get();

    let user = await User.findOne({ googleId: userInfo.id });

    if (!user) {
      user = await User.create({
        googleId: userInfo.id,
        email: userInfo.email,
        name: userInfo.name,
        avatar: userInfo.picture,
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
      });
    } else {
      user.accessToken = tokens.access_token;
      if (tokens.refresh_token) user.refreshToken = tokens.refresh_token;
      await user.save();
    }

    // Create JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // You can send it as a cookie or in response
    res.json({ token, user });
  } catch (err) {
    console.error("Google Auth Error:", err);
    res.status(500).send("Authentication Failed");
  }
};

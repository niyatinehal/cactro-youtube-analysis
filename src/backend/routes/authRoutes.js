const express = require("express");
const router = express.Router();
const { login, googleCallback } = require("../controllers/authController");

router.get("/google", login);
router.get("/google/callback", googleCallback);

module.exports = router;

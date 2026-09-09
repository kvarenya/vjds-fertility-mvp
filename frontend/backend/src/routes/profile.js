const express = require("express");
const router = express.Router();
const { getProfile } = require("../controllers/profileController");

// GET /profile/:id
router.get("/:id", getProfile);

module.exports = router;

const express = require("express");
const router = express.Router();
const { submitIntake } = require("../controllers/intakeController");

// POST /intake
router.post("/", submitIntake);

module.exports = router;

require("dotenv").config();
const express = require("express");
const cors = require("cors");

const intakeRoutes = require("./routes/intake");
const profileRoutes = require("./routes/profile");
const errorHandler = require("./middleware/errorHandler");

const app = express();

app.use(cors());
app.use(express.json());

// Simple health check so you can confirm the server is up
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/intake", intakeRoutes);
app.use("/profile", profileRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});

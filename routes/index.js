const express = require("express");
const router = express.Router();

// All route of User
const userRoutes = require("./api/users");
router.use("/user", userRoutes);

module.exports = router;

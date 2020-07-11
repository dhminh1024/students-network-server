const express = require("express");
const router = express.Router();

// All route of User
const userRoutes = require("./api/userApi");
router.use("/user", userRoutes);

module.exports = router;

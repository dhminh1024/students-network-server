const express = require("express");
const router = express.Router();

// All route of User
const userRoutes = require("./api/userApi");
router.use("/user", userRoutes);

// All route of Role
const roleRoutes = require("./api/roleApi");
router.use("/role", roleRoutes);

module.exports = router;

var express = require("express");
var router = express.Router();
const passport = require("passport");
const userValidations = require("../../models/user/userValidations");
const loginLogsController = require("../../controllers/loginLogControler");
const userController = require("../../controllers/userController");
const {
  authorization,
  authorizationForLogout,
  authentication,
  getClientInfo,
} = require("../../middleware/authentication");

/**
 * @route POST api/user/register
 * @description Register user route
 * @access Public
 */
router.post(
  "/register",
  userValidations.sanitizeRegister,
  userValidations.validateRegisterInput,
  getClientInfo,
  userController.Register
);

/**
 * @route POST api/user/login
 * @description Login user / Returning JWT Token
 * @access Public
 */
router.post(
  "/login",
  userValidations.sanitizeLogin,
  userValidations.validateLoginInput,
  getClientInfo,
  userController.Login
);

module.exports = router;

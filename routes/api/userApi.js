var express = require("express");
var router = express.Router();
const passport = require("passport");
const userValidations = require("../../models/user/userValidations");
const loginLogsController = require("../../controllers/loginLogControler");
const userController = require("../../controllers/userController");
const {
  authorization,
  authenticationForLogout,
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

/**
 * @route POST api/user/logout
 * @description remove token from loginlog
 * @access Public
 */
router.get("/logout", authenticationForLogout, loginLogsController.logout);

/**
 * @route GET api/user/profile
 * @description get user profile info
 * @access Public
 */
router.get("/profile", authentication, userController.GetProfile);

module.exports = router;

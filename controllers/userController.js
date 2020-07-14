const Users = require("../models/user/userSchema");
const Roles = require("../models/role/roleSchema");
const Accesses = require("../models/role/accessSchema");
const Modules = require("../models/role/moduleSchema");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const configMsg = require("../models/user/userValidationConfig");
const httpStatus = require("http-status");
const utilHelper = require("../helpers/util.helper");
const { secretOrKey, oauthConfig, tokenExpireTime } = require("../config/keys");
const loginLogController = require("./loginLogControler");
const appSetting = require("../config/settings");

const userController = {};

userController.validLoginResponse = async (req, user, next) => {
  try {
    let accesses = await Accesses.find(
      { role_id: user.roles, is_active: true },
      { access_type: 1, _id: 0 }
    );
    let routes = [];
    if (accesses && accesses.length) {
      const access = accesses
        .map((a) => a.access_type)
        .reduce((acc, curr) => [...curr, ...acc]);
      const routers = await Modules.find(
        { "path._id": access },
        { "path.admin_routes": 1, "path.access_type": 1 }
      );
      for (let i = 0; i < routers.length; i++) {
        for (let j = 0; j < routers[i].path.length; j++) {
          routes.push(routers[i].path[j]);
        }
      }
    }

    // Create JWT payload
    const payload = {
      id: user._id,
      name: user.name,
      email: user.email,
      email_verified: user.email_verified,
      roles: user.roles,
      gender: user.gender,
    };
    // Sign Token
    let token = await jwt.sign(payload, secretOrKey, {
      expiresIn: tokenExpireTime,
    });
    loginLogController.addLoginLog(req, token, next);
    token = `Bearer ${token}`;
    payload.routes = routes; // For controling module access
    return { token, payload };
  } catch (err) {
    next(err);
  }
};

userController.Register = async (req, res, next) => {
  if (!appSetting.public_register_allow) {
    return utilHelper.sendResponse(
      res,
      httpStatus.NOT_ACCEPTABLE,
      false,
      null,
      null,
      configMsg.notAllowPublicRegistration,
      null
    );
  }
  let email = req.body.email && req.body.email.toLowerCase();
  const user = await Users.findOne({ email: email });
  if (user) {
    const errors = { email: configMsg.validationMessage.emailExists };
    const data = { email: email };
    return utilHelper.sendResponse(
      res,
      httpStatus.CONFLICT,
      false,
      data,
      errors,
      errors.email,
      null
    );
  } else {
    const { name, password, gender } = req.body;
    const newUser = new Users({ name, email, password, gender });
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(newUser.password, salt);
    newUser.password = hash;
    // newUser.email_verification_code = utilHelper.generateRandomHexString(12);
    newUser.email_verified = true; // false
    newUser.roles = appSetting.public_register_role; // get id of default role in the db
    newUser.last_password_change_date = new Date();
    newUser.email_verified_request_date = new Date();
    const user = await newUser.save();
    // const renderedMail = await renderMail.renderTemplate(
    //   appSetting.public_register_email_template,
    //   {
    //     name: newUser.name,
    //     email: newUser.email,
    //     code: newUser.email_verification_code,
    //   },
    //   newUser.email
    // );
    // if (renderMail.error) {
    //   console.log("render mail error: ", renderMail.error);
    // } else {
    //   emailHelper.send(renderedMail);
    // }
    // if (appSetting.force_allow_email_verify) {
    //   return utilHelper.sendResponse(
    //     res,
    //     httpStatus.OK,
    //     true,
    //     { email_verified: false, email: email },
    //     null,
    //     "Verification email sent.",
    //     null
    //   );
    // }
    const { token, payload } = await userController.validLoginResponse(
      req,
      user,
      next
    );
    return utilHelper.sendResponse(
      res,
      httpStatus.OK,
      true,
      payload,
      null,
      null,
      token
    );
  }
};

userController.RegisterFromAdmin = async (req, res, next) => {
  try {
    const user = await Users.findOne({
      email: req.body.email,
      is_deleted: false,
    });
    if (user) {
      errors.email = "Email already exists";
      const data = { email: req.body.email };
      return utilHelper.sendResponse(
        res,
        httpStatus.CONFLICT,
        false,
        data,
        errors,
        errors.email,
        null
      );
    } else {
      const {
        name,
        email,
        password,
        date_of_birth,
        bio,
        location,
        phone,
        description,
        is_active,
        email_verified,
        roles,
        image,
        company_name,
        company_location,
        company_established,
        company_phone_no,
      } = req.body;
      const newUser = new User({
        name,
        email,
        password,
        date_of_birth,
        bio,
        description,
        email_verified,
        is_active,
        roles,
        image,
        location,
        phone,
        company_name,
        company_location,
        company_established,
        company_phone_no,
      });
      bcrypt.genSalt(10, async (err, salt) => {
        bcrypt.hash(newUser.password, salt, async (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser.email_verified = true; // TODO verify email
          newUser.roles = roles;
          newUser.added_by = req.user.id;
          newUser.is_active = true;
          newUser.is_added_by_admin = true;
          const user = await newUser.save();
          const payload = {
            id: user._id,
            name: user.name,
            email: user.email,
            email_verified: user.email_verified,
            roles: user.roles,
            gender: user.gender,
          };
          const msg = configMsg.registerAdmin;
          return utilHelper.sendResponse(
            res,
            httpStatus.OK,
            true,
            payload,
            null,
            msg,
            null
          );
        });
      });
    }
  } catch (err) {
    return next(err);
  }
};

userController.Login = async (req, res, next) => {
  try {
    let errors = {};
    const password = req.body.password;
    let email = req.body.email.toLowerCase();
    const user = await Users.findOne({ email });
    if (!user) {
      errors.email = configMsg.userNotFound;
      return utilHelper.sendResponse(
        res,
        httpStatus.NOT_FOUND,
        false,
        null,
        errors,
        errors.email,
        null
      );
    } else {
      // if (appSetting.force_allow_email_verify && !user.email_verified) {
      //   return utilHelper.sendResponse(res, httpStatus.NOT_ACCEPTABLE, false, { email: email, email_verified: false }, null, 'Please Verify your Email', null);
      // }
      // Check Password
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        const { token, payload } = await userController.validLoginResponse(
          req,
          user,
          next
        );
        return utilHelper.sendResponse(
          res,
          httpStatus.OK,
          true,
          payload,
          null,
          null,
          token
        );
      } else {
        errors.password = configMsg.wrongPassword;
        return utilHelper.sendResponse(
          res,
          httpStatus.BAD_REQUEST,
          false,
          null,
          errors,
          errors.password,
          null
        );
      }
    }
  } catch (err) {
    next(err);
  }
};

userController.GetProfile = async (req, res, next) => {
  try {
    let populate = [{ path: "roles", select: "_id role_title" }];
    const userProfile = await Users.findById(
      req.user.id,
      "name date_of_birth email added_at email_verified roles"
    ).populate(populate);
    return utilHelper.sendResponse(
      res,
      httpStatus.OK,
      true,
      userProfile,
      null,
      null,
      null
    );
  } catch (err) {
    next(err);
  }
};

module.exports = userController;

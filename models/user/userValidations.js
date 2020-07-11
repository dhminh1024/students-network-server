const httpStatus = require("http-status");
const configMsg = require("./userValidationConfig");
const utilHelper = require("../../helpers/util.helper");
const validations = {};

validations.sanitizeRegister = (req, res, next) => {
  const sanitizeArray = [
    {
      field: "name",
      sanitize: { trim: true },
    },
    {
      field: "email",
      sanitize: { trim: true },
    },
  ];
  utilHelper.sanitize(req, sanitizeArray);
  next();
};

validations.sanitizeLogin = (req, res, next) => {
  const sanitizeArray = [
    {
      field: "email",
      sanitize: { trim: true },
    },
  ];
  utilHelper.sanitize(req, sanitizeArray);
  next();
};

validations.validateLoginInput = (req, res, next) => {
  const data = req.body;
  const validateArray = [
    {
      field: "email",
      validate: [
        {
          condition: "IsEmpty",
          msg: configMsg.validate.empty,
        },
        {
          condition: "IsEmail",
          msg: configMsg.validate.isEmail,
        },
      ],
    },
    {
      field: "password",
      validate: [
        {
          condition: "IsEmpty",
          msg: configMsg.validate.empty,
        },
        {
          condition: "IsLength",
          msg: configMsg.validate.passLength,
          option: { min: 6, max: 30 },
        },
      ],
    },
  ];
  const errors = utilHelper.validation(data, validateArray);
  if (!utilHelper.isEmpty(errors)) {
    return utilHelper.sendResponse(
      res,
      httpStatus.BAD_REQUEST,
      false,
      null,
      errors,
      configMsg.validate.invalidInput,
      null
    );
  } else {
    next();
  }
};
validations.validateRegisterInput = (req, res, next) => {
  const data = req.body;
  const validateArray = [
    {
      field: "name",
      validate: [
        {
          condition: "IsEmpty",
          msg: configMsg.validate.empty,
        },
        {
          condition: "IsLength",
          msg: configMsg.validate.nameLength,
          option: { min: 2, max: 30 },
        },
      ],
    },
    {
      field: "email",
      validate: [
        {
          condition: "IsEmpty",
          msg: configMsg.validate.empty,
        },
        {
          condition: "IsEmail",
          msg: configMsg.validate.isEmail,
        },
      ],
    },
    {
      field: "password",
      validate: [
        {
          condition: "IsEmpty",
          msg: configMsg.validate.empty,
        },
        {
          condition: "IsLength",
          msg: configMsg.validate.passLength,
          option: { min: 6, max: 30 },
        },
      ],
    },
  ];
  const errors = utilHelper.validation(data, validateArray);
  if (!utilHelper.isEmpty(errors)) {
    return utilHelper.sendResponse(
      res,
      httpStatus.BAD_REQUEST,
      false,
      null,
      errors,
      configMsg.validate.invalidInput,
      null
    );
  } else {
    next();
  }
};

module.exports = validations;

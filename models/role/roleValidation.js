const httpStatus = require("http-status");
const utilHelper = require("../../helpers/util.helper");
const configMsg = require("./roleValidationConfig");
const validations = {};

validations.sanitizeRole = (req, res, next) => {
  const sanitizeArray = [
    {
      field: "role_title",
      sanitize: {
        trim: true,
      },
    },
    {
      field: "description",
      sanitize: {
        trim: true,
      },
    },
  ];
  utilHelper.sanitize(req, sanitizeArray);
  next();
};
validations.validateRole = (req, res, next) => {
  const data = req.body;
  const validationArray = [
    {
      field: "role_title",
      validate: [
        {
          condition: "IsEmpty",
          msg: configMsg.validate.empty,
        },
        {
          condition: "IsLength",
          msg: configMsg.validate.rolesLength,
          option: { min: 2, max: 20 },
        },
      ],
    },
    {
      field: "description",
      validate: [
        {
          condition: "IsEmpty",
          msg: configMsg.validate.empty,
        },
        {
          condition: "IsLength",
          msg: configMsg.validate.descriptionLength,
          option: { min: 5, max: 200 },
        },
      ],
    },
  ];
  const errors = utilHelper.validation(data, validationArray);
  if (!utilHelper.isEmpty(errors)) {
    return utilHelper.sendResponse(
      res,
      httpStatus.BAD_REQUEST,
      false,
      null,
      errors,
      "invalid input",
      null
    );
  } else {
    next();
  }
};

validations.sanitizeModule = (req, res, next) => {
  const sanitizeArray = [
    {
      field: "module_name",
      sanitize: {
        trim: true,
      },
    },
    {
      field: "description",
      sanitize: {
        trim: true,
      },
    },
  ];
  utilHelper.sanitize(req, sanitizeArray);
  next();
};
validations.validateModule = (req, res, next) => {
  const data = req.body;
  const validationArray = [
    {
      field: "module_name",
      validate: [
        {
          condition: "IsEmpty",
          msg: config.validate.empty,
        },
        {
          condition: "IsLength",
          msg: config.validate.rolesLength,
          option: { min: 2, max: 20 },
        },
      ],
    },
    {
      field: "description",
      validate: [
        {
          condition: "IsEmpty",
          msg: config.validate.empty,
        },
        {
          condition: "IsLength",
          msg: config.validate.descriptionLength,
          option: { min: 5, max: 200 },
        },
      ],
    },
  ];
  const errors = utilHelper.validation(data, validationArray);
  if (!utilHelper.isEmpty(errors)) {
    return utilHelper.sendResponse(
      res,
      httpStatus.BAD_REQUEST,
      false,
      null,
      errors,
      "invalid input",
      null
    );
  } else {
    next();
  }
};

validations.sanitizeAccess = (req, res, next) => {
  const sanitizeArray = [
    {
      field: "module_id",
      sanitize: {
        trim: true,
      },
    },
    {
      field: "role_id",
      sanitize: {
        trim: true,
      },
    },
  ];
  utilHelper.sanitize(req, sanitizeArray);
  next();
};
validations.validateAccess = (req, res, next) => {
  const data = req.body;
  const validateArray = [
    {
      field: "module_id",
      validate: [
        {
          condition: "IsMongoId",
          msg: config.validate.isMongo,
        },
      ],
    },
    {
      field: "role_id",
      validate: [
        {
          condition: "IsMongoId",
          msg: config.validate.isMongo,
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
      nul,
      errors,
      "invalid object id",
      null
    );
  } else {
    next();
  }
};

module.exports = validations;

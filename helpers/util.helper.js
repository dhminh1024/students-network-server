"use strict";
const Validator = require("validator");
const utilHelper = {};

utilHelper.sendResponse = (res, status, success, data, errors, msg, token) => {
  const response = {};
  if (success) response.success = success;
  if (data) response.data = data;
  if (errors) response.errors = errors;
  if (msg) response.msg = msg;
  if (token) response.token = token;
  return res.status(status).json(response);
};

utilHelper.paginationSendResponse = (
  res,
  status,
  success,
  data,
  msg,
  page,
  size,
  numDocuments
) => {
  const response = {};
  if (data) response.data = data;
  if (success) response.success = success;
  if (msg) response.msg = msg;
  if (page) response.page = page;
  if (size) response.size = size;
  if (typeof numDocuments === "number") response.numDocuments = numDocuments;
  return res.status(status).json(response);
};

utilHelper.parseFilters = (req, size_default, is_deleted) => {
  let size = size_default ? size_default : 10;
  let page;
  let sortQuery = { _id: -1 };
  let searchQuery = {};
  let populate = [];
  let selectQuery = { __v: 0 };
  if (is_deleted === null) {
  } else {
    searchQuery = { ...searchQuery, is_deleted: is_deleted };
    selectQuery = {
      ...selectQuery,
      is_deleted: 0,
      deleted_at: 0,
      deleted_by: 0,
    };
  }
  if (req.query.page && !isNaN(req.query.page) && req.query.page != 0) {
    page = Math.abs(req.query.page);
  } else {
    page = 1;
  }
  if (req.query.size && !isNaN(req.query.size) && req.query.size != 0) {
    size = Math.abs(req.query.size);
  }
  if (req.query.sort) {
    let sortfield = req.query.sort.slice(1);
    let sortby = req.query.sort.charAt(0);
    if (sortby == 1 && !isNaN(sortby) && sortfield) {
      //one is ascending
      sortQuery = sortfield;
    } else if (sortby == 0 && !isNaN(sortby) && sortfield) {
      //zero is descending
      sortQuery = "-" + sortfield;
    } else {
      sortQuery = "";
    }
  }
  return { page, size, sortQuery, searchQuery, selectQuery, populate };
};

utilHelper.getQuerySendResponse = async (
  model,
  page,
  size,
  sortQuery,
  findQuery,
  selectQuery,
  next,
  populate
) => {
  let data = {};
  try {
    data.data = await model
      .find(findQuery)
      .select(selectQuery)
      .sort(sortQuery)
      .skip((page - 1) * size)
      .limit(size)
      .populate(populate);
    data.numDocuments = await model.countDocuments(findQuery);
    return data;
  } catch (err) {
    next(err);
  }
};

utilHelper.isEmpty = (value) =>
  value === undefined ||
  value === null ||
  (typeof value === "object" && Object.keys(value).length === 0) ||
  (typeof value === "string" && value.trim().length === 0);

utilHelper.sanitize = (req, sanitizeArray) => {
  sanitizeArray.forEach((sanitizeObj) => {
    let sanitizefield = req.body[sanitizeObj.field];
    sanitizefield = !utilHelper.isEmpty(sanitizefield)
      ? sanitizefield + ""
      : "";
    const sanitization = sanitizeObj.sanitize;
    if (sanitization.rtrim) {
      sanitizefield = Validator.rtrim(sanitizefield);
    }
    if (sanitization.ltrim) {
      sanitizefield = Validator.ltrim(sanitizefield);
    }
    if (sanitization.blacklist) {
      sanitizefield = Validator.blacklist(sanitizefield);
    }
    if (sanitization.whitelist) {
      sanitizefield = Validator.whitelist(sanitizefield);
    }
    if (sanitization.trim) {
      sanitizefield = Validator.trim(sanitizefield);
    }
    if (sanitization.escape) {
      sanitizefield = Validator.escape(sanitizefield);
    }
    if (sanitization.unescape) {
      sanitizefield = Validator.unescape(sanitizefield);
    }
    if (sanitization.toBoolean) {
      sanitizefield = Validator.toBoolean(sanitizefield);
    }
    if (sanitization.toInt) {
      sanitizefield = Validator.toInt(sanitizefield);
    }
    if (sanitization.toFloat) {
      sanitizefield = Validator.toFloat(sanitizefield);
    }
    if (sanitization.toDate) {
      sanitizefield = Validator.toDate(sanitizefield);
    }
  });
  return true;
};

utilHelper.validation = (data, validationArray) => {
  let errors = {};
  validationArray.forEach((validationObj) => {
    let value = data[validationObj.field];
    value = !utilHelper.isEmpty(value) ? value + "" : "";
    const validation = validationObj.validate;
    for (let i = 0; i < validation.length; i++) {
      const val = validation[i];
      switch (val.condition) {
        case "IsEmpty":
          if (Validator.isEmpty(value)) {
            errors[validationObj.field] = val.msg;
          }
          break;
        case "IsLength":
          if (val.option) {
            if (!Validator.isLength(value, val.option)) {
              errors[validationObj.field] = val.msg;
            }
          }
          break;
        case "IsInt":
          if (val.option) {
            if (!Validator.isInt(value, val.option)) {
              errors[validationObj.field] = val.msg;
            }
          }
          break;
        case "IsEqual":
          if (val.option) {
            if (!Validator.equals(val.option.one, val.option.two)) {
              errors[validationObj.field] = val.msg;
            }
          }
          break;
        case "IsMongoId":
          if (!Validator.isMongoId(value)) {
            errors[validationObj.field] = val.msg;
          }
          break;
        case "IsIn":
          if (val.option) {
            if (!Validator.isIn(value, val.option)) {
              errors[validationObj.field] = val.msg;
            }
          }
          break;
        case "IsDate":
          if (!Validator.isISO8601(value)) {
            errors[validationObj.field] = val.msg;
          }
          break;
        case "IsEmail":
          if (!Validator.isEmail(value)) {
            errors[validationObj.field] = val.msg;
          }
          break;
        case "IsBoolean":
          if (!Validator.isBoolean(value.toString())) {
            errors[validationObj.field] = val.msg;
          }
          break;
        case "IsAfter":
          if (val.option) {
            if (!Validator.isAfter(value, val.option.date)) {
              errors[validationObj.field] = val.msg;
            }
          }
          break;
        case "IsURL":
          if (val.option) {
            if (!Validator.isURL(value, val.option.protocols)) {
              errors[validationObj.field] = val.msg;
            }
          }
          break;
        case "IsUppercase":
          if (!Validator.isUppercase(value)) {
            errors[validationObj.field] = val.msg;
          }
          break;
        case "IsPhone":
          let pn = new PhoneNumber(value);
          if (pn.isValid()) {
            if (val.option) {
              if (val.option.isMobile) {
                if (!pn.isMobile()) {
                  errors[validationObj.field] = "Enter mobile number";
                }
              } else {
                if (!pn.isFixedLine()) {
                  errors[validationObj.field] = "Enter landline number";
                }
              }
            }
          } else {
            errors[validationObj.field] = val.msg;
          }
          break;
        default:
          break;
      }
      if (errors[validationObj.field]) {
        i = validation.length;
      }
    }
  });
  return errors;
};

module.exports = utilHelper;

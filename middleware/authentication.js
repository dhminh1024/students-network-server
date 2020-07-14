"use strict";
const LoginLogs = require("../models/loginLog/loginLogSchema");
const Accesses = require("../models/role/accessSchema");
const Modules = require("../models/role/moduleSchema");
const Roles = require("../models/role/roleSchema");
const jwt = require("jsonwebtoken");
const HttpStatus = require("http-status");

const useragent = require("useragent");
const requestIp = require("request-ip");

const utilHelper = require("../helpers/util.helper");
const { secretOrKey } = require("../config/keys");
const authMiddleware = {};

authMiddleware.authentication = async (req, res, next) => {
  try {
    let token =
      req.body.token ||
      req.query.token ||
      req.headers["x-auth-token"] ||
      req.headers.authorization ||
      req.headers.token;
    if (token && token.length) {
      token = token.replace("Bearer ", "");
      const jwtpayload = await jwt.verify(token, secretOrKey);
      req.user = jwtpayload;
      let passed = await LoginLogs.findOne({ token, is_active: true });
      if (passed) {
        return next();
      } else {
        return utilHelper.sendResponse(
          res,
          HttpStatus.UNAUTHORIZED,
          false,
          null,
          null,
          "Session Expired",
          null
        );
      }
    }
    return utilHelper.sendResponse(
      res,
      HttpStatus.UNAUTHORIZED,
      false,
      null,
      token,
      "token not found",
      null
    );
  } catch (err) {
    return next(err);
  }
};

authMiddleware.authenticationForLogout = async (req, res, next) => {
  try {
    let token =
      req.body.token ||
      req.query.token ||
      req.headers["x-auth-token"] ||
      req.headers.authorization ||
      req.headers.token;
    if (token && token.length) {
      token = token.replace("Bearer ", "");
      const jwtpayload = await jwt.verify(token, secretOrKey);
      req.user = jwtpayload;
      return next();
    }
    return utilHelper.sendResponse(
      res,
      HttpStatus.UNAUTHORIZED,
      false,
      null,
      token,
      "token not found",
      null
    );
  } catch (err) {
    return next(err);
  }
};

authMiddleware.authorization = async (req, res, next) => {
  try {
    const user = req.user;
    const roles = await Roles.find({ _id: { $in: user.roles } }, { _id: 1 });
    let path = req.baseUrl + req.route.path;
    if (path.substr(path.length - 1) === "/") {
      path = path.slice(0, path.length - 1);
    }
    const method = req.method;
    const GetModuleFilter = {
      "path.server_routes.method": method,
      "path.server_routes.route": path,
    };
    const modules = await Modules.findOne(GetModuleFilter, { path: 1 });
    let moduleAccessTypeId = null;
    if (!utilHelper.isEmpty(modules) && !utilHelper.isEmpty(modules.path)) {
      for (let i = 0; i < modules.path.length; i++) {
        const routes = modules.path[i].server_routes;
        for (let j = 0; j < routes.length; j++) {
          if (routes[j].method === method && routes[j].route === path) {
            moduleAccessTypeId = modules.path[i]._id;
          }
        }
      }
    } else {
      return utilHelper.sendResponse(
        res,
        HttpStatus.UNAUTHORIZED,
        false,
        null,
        null,
        "Authorization Failed: Module path not found",
        null
      );
    }

    const moduleId = modules && modules._id;
    if (roles && roles.length && moduleId && moduleAccessTypeId) {
      for (let i = 0; i < roles.length; i++) {
        const activeRole = roles[i];
        const accessFilter = {
          role_id: activeRole._id,
          is_active: true,
          module_id: moduleId,
          access_type: moduleAccessTypeId,
        };
        const access = await Accesses.findOne(accessFilter);
        if (access && access.access_type) {
          return next();
        }
      }
      return utilHelper.sendResponse(
        res,
        HttpStatus.UNAUTHORIZED,
        false,
        null,
        null,
        "Authorization Failed: Not enough permission",
        null
      );
    } else {
      return utilHelper.sendResponse(
        res,
        HttpStatus.UNAUTHORIZED,
        false,
        null,
        null,
        "Authorization Failed: Permission required",
        null
      );
    }
  } catch (err) {
    next(err);
  }
};

authMiddleware.getClientInfo = async (req, res, next) => {
  let info = {};

  let agent = useragent.parse(req.headers["user-agent"]);
  // let another = useragent.fromJSON(JSON.stringify(agent));

  info.browser = agent.toAgent().toString();
  info.os = agent.os.toString();
  info.device = agent.device.toString();

  info.ip = requestIp.getClientIp(req);
  // on localhost you'll see 127.0.0.1 if you're using IPv4
  // or ::1, ::ffff:127.0.0.1 if you're using IPv6

  req.clinfo = info;
  return next();
};

module.exports = authMiddleware;

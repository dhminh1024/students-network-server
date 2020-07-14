const httpStatus = require("http-status");
const utilHelper = require("../helpers/util.helper");
const Roles = require("../models/role/roleSchema");
const Modules = require("../models/role/moduleSchema");
const Accesses = require("../models/role/accessSchema");
const configMsg = require("../models/role/roleValidationConfig");
const roleController = {};

roleController.GetRoles = async (req, res, next) => {
  try {
    let {
      page,
      size,
      populate,
      selectQuery,
      searchQuery,
      sortQuery,
    } = utilHelper.parseFilters(req, 10, false);
    if (req.query.page && req.query.page == 0) {
      selectQuery = "role_title description is_active is_deleted";
      const roles = await Roles.find(searchQuery).select(selectQuery);
      return utilHelper.sendResponse(
        res,
        httpStatus.OK,
        true,
        roles,
        null,
        "all roles get success!!",
        null
      );
    }
    if (req.query.find_role_title) {
      searchQuery = {
        role_title: { $regex: req.query.find_role_title, $options: "i" },
        ...searchQuery,
      };
    }

    if (req.query.is_active) {
      searchQuery = { is_active: true, ...searchQuery };
    }

    let data = await utilHelper.getQuerySendResponse(
      Roles,
      page,
      size,
      sortQuery,
      searchQuery,
      selectQuery,
      next,
      populate
    );

    return utilHelper.paginationSendResponse(
      res,
      httpStatus.OK,
      true,
      data.data,
      configMsg.roleGet,
      page,
      size,
      data.numDocuments
    );
  } catch (err) {
    next(err);
  }
};

roleController.GetRoleDetail = async (req, res, next) => {
  const roles = await Roles.findById(req.params.id, {
    is_active: 1,
    role_title: 1,
    description: 1,
  });
  return utilHelper.sendResponse(
    res,
    httpStatus.OK,
    true,
    roles,
    null,
    configMsg.roleGet,
    null
  );
};

roleController.SaveRole = async (req, res, next) => {
  try {
    const role = req.body;
    if (role._id) {
      const update = await Roles.findByIdAndUpdate(
        role._id,
        { $set: role },
        { new: true }
      );
      return utilHelper.sendResponse(
        res,
        httpStatus.OK,
        true,
        update,
        null,
        configMsg.roleSave,
        null
      );
    } else {
      role.created_by = req.user.id;
      role.created_at = new Date();
      const newRole = new Roles(role);
      await newRole.save();
      return utilHelper.sendResponse(
        res,
        httpStatus.OK,
        true,
        newRole,
        null,
        configMsg.roleSave,
        null
      );
    }
  } catch (err) {
    next(err);
  }
};

roleController.DeleteRole = async (req, res, next) => {
  try {
    const id = req.params.id;
    const deleted = await Roles.findByIdAndUpdate(id, {
      $set: {
        is_deleted: true,
        deleted_at: new Date(),
        deleted_by: req.user.id,
      },
    });
    return utilHelper.sendResponse(
      res,
      httpStatus.OK,
      true,
      deleted,
      null,
      configMsg.delete,
      null
    );
  } catch (err) {
    next(err);
  }
};

roleController.GetModules = async (req, res, next) => {
  try {
    let {
      page,
      size,
      populate,
      selectQuery,
      searchQuery,
      sortQuery,
    } = utilHelper.parseFilters(req, 10, false);
    if (req.query.page && req.query.page == 0) {
      selectQuery = "module_name description order path";
      const modules = await Modules.find(searchQuery).select(selectQuery);
      return utilHelper.sendResponse(
        res,
        httpStatus.OK,
        true,
        modules,
        null,
        "all modules get success!!",
        null
      );
    }
    if (req.query.find_module_name) {
      searchQuery = {
        role_title: { $regex: req.query.find_module_name, $options: "i" },
        ...searchQuery,
      };
    }

    let data = await utilHelper.getQuerySendResponse(
      Modules,
      page,
      size,
      sortQuery,
      searchQuery,
      selectQuery,
      next,
      populate
    );

    return utilHelper.paginationSendResponse(
      res,
      httpStatus.OK,
      true,
      data.data,
      configMsg.moduleGet,
      page,
      size,
      data.numDocuments
    );
  } catch (err) {
    next(err);
  }
};

roleController.GetModuleDetail = async (req, res, next) => {
  const moduleData = await Modules.findById(req.params.id);
  return utilHelper.sendResponse(
    res,
    httpStatus.OK,
    true,
    moduleData,
    null,
    configMsg.moduleGet,
    null
  );
};

roleController.SaveModule = async (req, res, next) => {
  try {
    const moduleData = req.body;
    if (moduleData._id) {
      const update = await Modules.findByIdAndUpdate(
        moduleData._id,
        { $set: moduleData },
        { new: true }
      );
      return utilHelper.sendResponse(
        res,
        httpStatus.OK,
        true,
        update,
        null,
        configMsg.moduleSave,
        null
      );
    } else {
      moduleData.created_by = req.user.id;
      moduleData.created_at = new Date();
      const newModule = new Modules(moduleData);
      await newModule.save();
      return utilHelper.sendResponse(
        res,
        httpStatus.OK,
        true,
        newModule,
        null,
        configMsg.moduleSave,
        null
      );
    }
  } catch (err) {
    next(err);
  }
};

roleController.DeleteModule = async (req, res, next) => {
  try {
    const id = req.params.id;
    const deleted = await Modules.findByIdAndUpdate(id, {
      $set: {
        is_deleted: true,
        deleted_at: new Date(),
        deleted_by: req.user.id,
      },
    });
    return utilHelper.sendResponse(
      res,
      httpStatus.OK,
      true,
      deleted,
      null,
      configMsg.delete,
      null
    );
  } catch (err) {
    next(err);
  }
};

roleController.GetAccessList = async (req, res, next) => {
  try {
    selectQuery = "_id is_active access_type module_id role_id";
    const accesses = await Accesses.find().select(selectQuery);
    return utilHelper.sendResponse(
      res,
      httpStatus.OK,
      true,
      accesses,
      null,
      "Accesses get success!!",
      null
    );
  } catch (err) {
    next(err);
  }
};

roleController.SaveAccess = async (req, res, next) => {
  try {
    const access = req.body;
    if (access._id) {
      const update = await Accesses.findByIdAndUpdate(
        access._id,
        { $set: access },
        { new: true }
      );
      return utilHelper.sendResponse(
        res,
        httpStatus.OK,
        true,
        update,
        null,
        configMsg.accessSave,
        null
      );
    } else {
      access.created_by = req.user.id;
      access.created_at = new Date();
      const newAccess = new Accesses(access);
      await newAccess.save();
      return utilHelper.sendResponse(
        res,
        httpStatus.OK,
        true,
        newAccess,
        null,
        configMsg.accessSave,
        null
      );
    }
  } catch (err) {
    next(err);
  }
};

roleController.SaveAccessListFromRole = async (req, res, next) => {
  try {
    const roleId = req.params.role_id;
    const accesses = req.body.accesses;
    let savedAccesses = [];
    if (accesses.length) {
      for (let i = 0; i < accesses.length; i++) {
        if (accesses[i]._id) {
          accesses[i].role_id = roleId;
          const update = await Accesses.findByIdAndUpdate(
            accesses[i]._id,
            { $set: accesses[i] },
            { new: true }
          );
          savedAccesses.push(update);
        } else {
          accesses[i].role_id = roleId;
          accesses[i].created_by = req.user.id;
          accesses[i].created_at = new Date();
          const newAccess = new Accesses(accesses[i]);
          const data = await newAccess.save();
          savedAccesses.push(data);
        }
      }
      return utilHelper.sendResponse(
        res,
        httpStatus.OK,
        true,
        savedAccesses,
        null,
        configMsg.accessSave,
        null
      );
    } else {
      return utilHelper.sendResponse(
        res,
        httpStatus.NOT_MODIFIED,
        false,
        null,
        "Nothing to save!!",
        "Nothing to save!!",
        null
      );
    }
  } catch (err) {
    next(err);
  }
};

roleController.SaveAccessListFromModule = async (req, res, next) => {
  try {
    const moduleId = req.params.module_id;
    const accesses = req.body.accesses;
    let savedAccesses = [];
    if (accesses.length) {
      for (let i = 0; i < accesses.length; i++) {
        if (accesses[i]._id) {
          accesses[i].module_id = moduleId;
          const update = await Accesses.findByIdAndUpdate(
            accesses[i]._id,
            { $set: accesses[i] },
            { new: true }
          );
          savedAccesses.push(update);
        } else {
          accesses[i].module_id = moduleId;
          accesses[i].created_by = req.user.id;
          accesses[i].created_at = new Date();
          const newAccess = new Accesses(accesses[i]);
          const data = await newAccess.save();
          savedAccesses.push(data);
        }
      }
      return utilHelper.sendResponse(
        res,
        httpStatus.OK,
        true,
        savedAccesses,
        null,
        configMsg.accessSave,
        null
      );
    } else {
      return utilHelper.sendResponse(
        res,
        httpStatus.NOT_MODIFIED,
        false,
        null,
        "Nothing to save!!",
        "Nothing to save!!",
        null
      );
    }
  } catch (err) {
    next(err);
  }
};

roleController.GetAccessListForRole = async (req, res, next) => {
  try {
    const roleId = req.params.role_id;
    const accessesForRole = await Accesses.find(
      { role_id: roleId },
      { _id: 1, access_type: 1, is_active: 1, module_id: 1, role_id: 1 }
    );
    const modulesForRole = await Modules.find(
      {},
      { _id: 1, module_name: 1, "path.access_type": 1, "path._id": 1 }
    );
    const roles = await Roles.find({}, { _id: 1, role_title: 1, is_active: 1 });
    return utilHelper.sendResponse(
      res,
      httpStatus.OK,
      true,
      { Accesses: accessesForRole, Modules: modulesForRole, Roles: roles },
      null,
      "Access Get Success !!",
      null
    );
  } catch (err) {
    next(err);
  }
};

roleController.GetAccessListForModule = async (req, res, next) => {
  try {
    const moduleId = req.params.module_id;
    const accessesForModule = await Accesses.find(
      { module_id: moduleId, is_deleted: false },
      { _id: 1, access_type: 1, is_active: 1, module_id: 1, role_id: 1 }
    );
    const modules = await Modules.find(
      { _id: moduleId, is_deleted: false },
      { _id: 1, module_name: 1, "path.access_type": 1, "path._id": 1 }
    );
    const roles = await Roles.find(
      { is_deleted: false },
      { _id: 1, role_title: 1, is_active: 1 }
    );
    return utilHelper.sendResponse(
      res,
      httpStatus.OK,
      true,
      { Accesses: accessesForModule, Modules: modules, Roles: roles },
      null,
      "Access Get Success !!",
      null
    );
  } catch (err) {
    next(err);
  }
};

module.exports = roleController;

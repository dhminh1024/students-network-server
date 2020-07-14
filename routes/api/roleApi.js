const express = require("express");
const router = express.Router();
const roleController = require("../../controllers/roleController");
const validations = require("../../models/role/roleValidation");
const {
  authentication,
  authorization,
} = require("../../middleware/authentication");

router.get("/role", authentication, roleController.GetRoles);
router.get("/role/:id", authentication, roleController.GetRoleDetail);
router.post(
  "/role",
  authentication,
  validations.sanitizeRole,
  validations.validateRole,
  roleController.SaveRole
);
router.delete("/role/:id", authentication, roleController.DeleteRole);

router.get("/module", authentication, roleController.GetModules);
router.get("/module/:id", authentication, roleController.GetModuleDetail);
router.post(
  "/module",
  authentication,
  validations.sanitizeModule,
  validations.validateModule,
  roleController.SaveModule
);
router.get("/access", authentication, roleController.GetAccessList);
router.post(
  "/access",
  authentication,
  validations.sanitizeAccess,
  validations.validateAccess,
  roleController.SaveAccess
);

/**
 * Access Management of Role to all Module
 */
router.get(
  "/access/role/:role_id",
  authentication,
  roleController.GetAccessListForRole
);
router.post(
  "/access/role/:role_id",
  authentication,
  roleController.SaveAccessListFromRole
);

/**
 *Access Management of Module to all roles
 */
router.get(
  "/access/module/:module_id",
  authentication,
  roleController.GetAccessListForModule
);
router.post(
  "/access/module/:module_id",
  authentication,
  roleController.SaveAccessListFromModule
);

module.exports = router;

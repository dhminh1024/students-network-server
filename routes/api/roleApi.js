const express = require("express");
const router = express.Router();
const roleController = require("../../controllers/roleController");
const validations = require("../../models/role/roleValidation");
const {
  authentication,
  authorization,
} = require("../../middleware/authentication");

router.get("/role", authorization, roleController.GetRoles);
router.get("/role/:id", authorization, roleController.GetRoleDetail);
router.post(
  "/role",
  authorization,
  validations.sanitizeRole,
  validations.validateRole,
  roleController.SaveRole
);
router.delete("/role/:id", authorization, roleController.DeleteRole);

module.exports = router;

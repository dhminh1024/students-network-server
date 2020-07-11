const mongoose = require("mongoose");
const schema = mongoose.Schema;

const rolesSchema = new schema({
  role_title: { type: String, required: true },
  description: { type: String, required: false },
  is_active: { type: Boolean, required: true, default: true },

  created_at: { type: Date, default: Date.now, required: true },
  created_by: { type: schema.Types.ObjectId, ref: "users" },
  updated_at: { type: Date },
  updated_by: { type: schema.Types.ObjectId, ref: "users" },
  is_deleted: { type: Boolean, default: false, required: true },
  deleted_by: { type: schema.Types.ObjectId, ref: "users" },
  deleted_at: { type: Date },
});

module.exports = Roles = mongoose.model("roles", rolesSchema);

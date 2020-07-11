const mongoose = require("mongoose");
const schema = mongoose.Schema;

const accessSchema = new schema({
  module_id: {
    type: schema.Types.ObjectId,
    required: true,
    ref: "modules",
  },
  role_id: { type: schema.Types.ObjectId, required: true, ref: "roles" },
  access_type: [{ type: [schema.Types.ObjectId], required: true }],
  is_active: { type: Boolean, required: true, default: true },

  created_at: { type: Date, default: Date.now, required: true },
  created_by: { type: schema.Types.ObjectId, ref: "users" },
  updated_at: { type: Date },
  updated_by: { type: schema.Types.ObjectId, ref: "users" },
  is_deleted: { type: Boolean, default: false, required: true },
  deleted_by: { type: schema.Types.ObjectId, ref: "users" },
  deleted_at: { type: Date },
});

module.exports = Accesses = mongoose.model("accesses", accessSchema);

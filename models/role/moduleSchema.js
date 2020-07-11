const mongoose = require("mongoose");
const schema = mongoose.Schema;

const moduleSchema = new schema({
  module_name: { type: String, required: true, unique: true },
  description: { type: String },
  order: { type: Number },
  path: [
    {
      access_type: { type: String, required: true },
      access_type_description: { type: String },
      admin_routes: [{ type: String, required: true }],
      server_routes: [
        {
          route: { type: String, required: true },
          method: { type: String, require: true },
        },
      ],
    },
  ],

  created_at: { type: Date, default: Date.now, required: true },
  created_by: { type: schema.Types.ObjectId, ref: "users" },
  updated_at: { type: Date },
  updated_by: { type: schema.Types.ObjectId, ref: "users" },
  is_deleted: { type: Boolean, default: false, required: true },
  deleted_by: { type: schema.Types.ObjectId, ref: "users" },
  deleted_at: { type: Date },
});

module.exports = Modules = mongoose.model("modules", moduleSchema);

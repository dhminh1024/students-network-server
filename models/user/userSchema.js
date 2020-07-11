const mongoose = require("mongoose");
const schema = mongoose.Schema;

const userSchema = new schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  gender: { type: String, enum: ["male", "female", "other"] },
  avatar: { type: String },
  date_of_birth: { type: Date },
  email_verified: { type: Boolean, required: true, default: false },
  email_verification_code: { type: String },
  email_verified_request_date: { type: Date },
  password_reset_code: { type: String },
  password_reset_request_date: { type: Date },
  last_password_change_date: { type: Date },
  is_active: { type: Boolean, required: true, default: false },
  is_added_by_admin: { type: Boolean, required: true, default: false },
  roles: [{ type: [schema.Types.ObjectId], required: true, ref: "roles" }],
  bio: { type: String },
  description: { type: String },
  points: { type: Number },

  created_at: { type: Date, default: Date.now, required: true },
  created_by: { type: schema.Types.ObjectId, ref: "users" },
  updated_at: { type: Date },
  updated_by: { type: schema.Types.ObjectId, ref: "users" },
  is_deleted: { type: Boolean, default: false, required: true },
  deleted_by: { type: schema.Types.ObjectId, ref: "users" },
  deleted_at: { type: Date },
});

module.exports = Users = mongoose.model("user", userSchema);

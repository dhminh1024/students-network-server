const mongoose = require("mongoose");
const schema = mongoose.Schema;

const bugSchema = new schema({
  error_message: { type: String, required: true },
  error_stack: { type: String },
  error_type: { type: String },
  added_by: { type: schema.Types.ObjectId, ref: "users" },
  device: { type: schema.Types.Mixed },
  ip: { type: schema.Types.Mixed },
  count: { type: Number, default: 1 },
  added_at: { type: Date, default: Date.now },
  last_added_at: { type: Date },
  is_deleted: { type: Boolean, default: false },
});

module.exports = Bugs = mongoose.model("bugs", bugSchema);

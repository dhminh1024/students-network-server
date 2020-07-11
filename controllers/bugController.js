const httpStatus = require("http-status");
const Bugs = require("../models/bug/bugSchema");
const errorHelper = require("../helpers/error.helper");
const utilHelper = require("../helpers/util.helper");
const bugController = {};

bugController.AddErrorToLogs = async (req, res, next, err) => {
  const is_already = await Bugs.findOne({ error_message: err.message });
  if (is_already) {
    await Bugs.findOneAndUpdate(
      { error_message: err.message },
      {
        $set: {
          count: is_already.count + 1,
          last_added_at: Date.now(),
          added_by: req.user && req.user.id,
        },
      },
      { new: true }
    );
    return;
  }
  const errObj = errorHelper.getErrorObj(err, next);
  errObj.added_by = req.user && req.user.id;
  errObj.device = req.device;
  errObj.ip = req.client_ip_address;
  const bug = await Bugs(errObj);
  return bug.save();
};

module.exports = bugController;

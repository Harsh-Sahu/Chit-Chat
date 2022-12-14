const User = require("../models/userModel");

module.exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({ _id: { $ne: req.params.id } }).select([
      "lock_array",
    ]);
    return res.json(users);
  } catch (ex) {
    next(ex);
  }
};

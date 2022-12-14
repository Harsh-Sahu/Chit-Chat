const mongoose = require("mongoose");

const lockSchema = new mongoose.Schema({
  lock_status: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("Lock", lockSchema);

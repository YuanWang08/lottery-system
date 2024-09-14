const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const unitSchema = new Schema({
  student_number: { type: String, required: true },
  department: { type: String, required: true },
  grade: { type: String, required: true },
  name: { type: String, required: true },
  isFacebook: { type: Boolean, required: true },
  isInstagram: { type: Boolean, required: true },
  isDiscord: { type: Boolean, required: true },
  facebook_id: { type: String, required: false },
  instagram_id: { type: String, required: false },
  discord_id: { type: String, required: false },
  lotteries: { type: [String], required: false },
});

const UnitModel = mongoose.model("Unit", unitSchema);

module.exports = UnitModel;

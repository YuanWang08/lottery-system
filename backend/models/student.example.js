const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const studentSchema = new Schema({
  number: String,
  department: String,
  name: String,
  remarks: String,
});

const StudentModel = mongoose.model('Student', studentSchema);

module.exports = StudentModel;
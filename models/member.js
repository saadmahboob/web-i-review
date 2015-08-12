var Mongoose = require('mongoose');

var memberSchema = new Mongoose.Schema({
  email:                { type: String, required: true },
  firstName:            { type: String, required: true },
  lastName:             { type: String, required: true },
  mobileNumber:         { type: String },
  hashedPassword:       { type: String, required: true }
});

module.exports = Mongoose.model('Member', memberSchema);
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    unique: true,
    require: true,
  },

  password: {
    type: String,
    required: true,
    max: 100,
  },
});

const User = mongoose.model("User", UserSchema);

module.exports = { User };

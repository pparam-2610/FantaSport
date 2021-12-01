const mongoose = require("mongoose");

const usersSchema = new mongoose.Schema({
  userId: {
    type: String,
    unique: true,
  },
  googleId: {
    type: String,
  },
  number: {
    type: String,
  },
  name: {
    type: String,
  },
  password: {
    type: String,
  },
  admin: {
    type: Boolean,
    required: true,
  },
});

module.exports = mongoose.model("Users", usersSchema);

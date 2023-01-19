const { Schema, model } = require("mongoose");

const UserSchema = new Schema({
  email: {
    type: String,
    unique: true,
  },
  password: String,
});

const User = model("user", UserSchema);

module.exports = User;

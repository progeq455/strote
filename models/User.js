const { Schema, model, ObjectId } = require("mongoose");

const User = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatar: { type: Number,  min: 1, max: 8 },
  name: { type: String, required: true }
});

module.exports = model("User", User);
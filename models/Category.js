const { model, Schema, ObjectId } = require("mongoose");

const Category = new Schema({
  user: { type: ObjectId, ref: "User" },
  title: { type: String, required: true, maxlength: 50 },
  description: { type: String, maxlength: 150 },
  color: { type: Number, min: 1, max: 8 },
  icon: { type: Number, min: 1, max: 25 },
  dataCreated: { type: Date },
});

module.exports = model("Category", Category);

const { model, Schema, ObjectId } = require("mongoose");

const Note = new Schema({
  user: { type: ObjectId, ref: "User" },
  title: { type: String, required: true, maxlength: 120 },
  description: { type: String, maxlength: 500 },
  icon: { type: Number, min: 1, max: 25 },
  status: { type: Number, min: 1, max: 3, required: true, default: 1 },
  statusData: { type: Date },
  color: { type: Number, min: 1, max: 10 },
  category: { type: ObjectId, ref: "Category" },
  categoryData: { type: Date },
  dataCreated: { type: Date, required: true },
});

module.exports = model("Note", Note);

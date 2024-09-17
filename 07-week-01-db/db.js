const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
});
const taskSchema = new mongoose.Schema({
  description: String,
  isCompleted: Boolean,
  createdBy: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
});

const User = mongoose.model("User", userSchema);
const Task = mongoose.model("Task", taskSchema);

module.exports = {
  User,
  Task,
};

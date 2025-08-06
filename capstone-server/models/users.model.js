import mongoose from "mongoose";
import bcrypt from "bcrypt";

// User Schema Definition
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: false },
  tasks:    [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }],
  ownedProjects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Project" }],
  memberProjects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Project" }]
});

// No pre-save hook needed as password is hashed in the route

const User = mongoose.model("User", userSchema);

export default User;
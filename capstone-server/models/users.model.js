import mongoose from "mongoose";
import bcrypt from "bcrypt";

// User Schema Definition
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
  tasks:    [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }],
  ownedProjects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Project" }],
  memberProjects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Project" }]
});

// Pre-save hook to hash the password before saving (optional, if not hashed in route)
userSchema.pre("save", async function(next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

const User = mongoose.model("User", userSchema);

export default User;
import mongoose from "mongoose";

// User Schema Definition
const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: false },

    // Profile fields
    title: { type: String, default: "Employee" },
    avatarUrl: {
      type: String,
      default: "https://placehold.co/128x128/a7f3d0/14532d?text=User",
    },
    bannerUrl: {
      type: String,
      default: "https://placehold.co/1200x300/e0e7ff/4338ca",
    },
    workStartDate: { type: Date, default: Date.now },

    // Relationships
    tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }],
    ownedProjects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Project" }],
    memberProjects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Project" }],
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

// No pre-save hook needed as password is hashed in the route

const User = mongoose.model("User", userSchema);

export default User;

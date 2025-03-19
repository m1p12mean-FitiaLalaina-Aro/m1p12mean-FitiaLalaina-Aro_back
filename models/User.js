const mongoose = require("mongoose");
// const RolePermission = require("./RolePermission");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "manager" , "mecanicien"], default: "user" },
  },
  { timestamps: true } 
);

userSchema.methods.hasPermission = async function (permissionName) {
  const RolePermission = require("./RolePermission"); 
  const rolePermission = await RolePermission.findOne({ role: this.role }).populate("permissions");
  if (!rolePermission) return false;
  return rolePermission.permissions.some((perm) => perm.name === permissionName);
};

const User = mongoose.model("User", userSchema);
module.exports = User;

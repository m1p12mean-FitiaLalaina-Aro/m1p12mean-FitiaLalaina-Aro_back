const mongoose = require("mongoose");
const Permission = require("./Permission");

const rolePermissionSchema = new mongoose.Schema({
  role: { type: String, required: true, unique: true }, 
  permissions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Permission",default: [] }] 
});

const RolePermission = mongoose.model("RolePermission", rolePermissionSchema);
module.exports = RolePermission;

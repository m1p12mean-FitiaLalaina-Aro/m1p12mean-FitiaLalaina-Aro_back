const mongoose = require("mongoose");

const userConnectedSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  token: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 3600 }, // Expiration après 1h
});

const UserConnected = mongoose.model("UserConnected", userConnectedSchema);
module.exports = UserConnected;

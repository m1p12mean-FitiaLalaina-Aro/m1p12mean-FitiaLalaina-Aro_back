const mongoose = require("mongoose");

const userCartSchema = new mongoose.Schema(
  {
    marque: { type: String, required: true },
    probleme: { type: String, required: true },
    description: { type: String, required: true },
    budget: { type: Number }, 
    dateHeureReparation: { type: Date }, 
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" } 
  },
  { timestamps: true }                                                                                                                      
);

const UserCart = mongoose.model("UserCart", userCartSchema);
module.exports = UserCart;

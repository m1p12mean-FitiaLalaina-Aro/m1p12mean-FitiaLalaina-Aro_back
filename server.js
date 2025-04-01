const express = require("express");
const connectDB = require("./config/connect");
const dotenv = require("dotenv");
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const roleRoutes = require("./routes/roleRoutes");
const userCartRoutes = require("./routes/userCartRoutes");
const offreRoutes = require("./routes/offreRoutes");
const mecanicienRoutes = require("./routes/mecanicienRoutes");

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/roles", roleRoutes);
app.use("/api/user-carts", userCartRoutes);
app.use("/api/offres", offreRoutes);
app.use("/api/mecanicien-fiche", mecanicienRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`));

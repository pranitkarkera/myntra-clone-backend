require("dotenv").config();
const express = require("express");
const cors = require("cors");
const productRoutes = require("./routes/productsRoutes");
const categoryRoutes = require("./routes/categoriesRoutes");
const wishlistRoutes = require("./routes/wishlistRoutes");
const cartRoutes = require("./routes/cartRoutes");
const userRoutes = require("./routes/userRoutes");
const addressRoutes = require("./routes/addressRoutes");
const ordersRoutes = require("./routes/ordersRoutes");
const { initializeDatabase } = require("./db/db.connection");

const app = express();

const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.json({ message: "Api is working!" });
});

app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/address", addressRoutes);
app.use("/api/user", userRoutes);
app.use("/api/orders", ordersRoutes);

initializeDatabase();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

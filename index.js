require("dotenv").config();
const express = require("express");
const cors = require("cors");
const productRoutes = require("./routes/products");
const categoryRoutes = require("./routes/categories");
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


initializeDatabase();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

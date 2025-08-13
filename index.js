const express = require("express");
const app = express();
require("dotenv").config();
const mongoose = require("mongoose");
const userRouters = require("./routes/user");
const categoryRouters = require("./routes/category");
const subcategoryRouters = require("./routes/subcategory");
const productRouters = require("./routes/product");
const cartRouter = require("./routes/cart");
const adminDashboard = require("./routes/admin-dashboard");
const orderRouter = require("./routes/order");
const authRouter = require("./routes/Auth");

// enviromental variables
const PORT = process.env.PORT || 3000;
const MONGODB_URL = process.env.MONGODB_URL;
const API_URL = process.env.API;
// middlewear
app.use(express.json());

// routes
app.use(`${API_URL}/users`, userRouters);
app.use(`${API_URL}/categories`, categoryRouters);
app.use(`${API_URL}/subcategories`, subcategoryRouters);
app.use(`${API_URL}/products`, productRouters);
app.use(`${API_URL}/carts`, cartRouter);
app.use(`${API_URL}/admin`, adminDashboard);
app.use(`${API_URL}/orders`, orderRouter);
app.use(`${API_URL}/auth`, authRouter);

// connects to db
mongoose
  .connect(MONGODB_URL, {
    dbName: "AgroShop",
  })
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

// connects to port
app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});

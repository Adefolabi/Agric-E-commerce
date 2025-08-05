const express = require("express");
const app = express();
require("dotenv").config();
const mongoose = require("mongoose");
const userRouters = require("./routes/user");

// enviromental variables
const PORT = process.env.PORT || 3000;
const MONGODB_URL = process.env.MONGODB_URL;
const API_URL = process.env.API;

// middlewear
app.use(express.json());

// routes
app.use(`${API_URL}/users`, userRouters);

// connects to db
mongoose
  .connect(MONGODB_URL,{
  dbName: 'AgroShop',
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

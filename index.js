const express = require("express");
const app = express();
require("dotenv").config();
const mongoose = require("mongoose");

// enviromental variables
const PORT = process.env.PORT || 3000;
const MONGODB_URL = process.env.MONGODB_URL;


// connects to db
mongoose.connect(MONGODB_URL).then(()=>{
    console.log("connected to DB")
}).catch((err)=>{
    console.log(err)
})

// connects to port
app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});

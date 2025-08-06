const jwt = require("jsonwebtoken");
require("dotenv").config();

const AUTH = async (req, res, next) => {
  const authHeader = req.header("Authorization");
  //   console.log("Auth Header:", authHeader);
  //   console.log(authHeader.startsWith("Bearer "));
  if (
    !authHeader ||
    !authHeader.startsWith("Bearer ") ||
    authHeader == undefined
  )
    return res.json({message:"unauthorized"}).status(401);
  try {
    const token = authHeader.split(" ")[1];
    const verified = jwt.verify(token, process.env.SECRET_KEY);
    if (!verified) return res.json({message:"access granted"}).status(500);
    req.user = verified;
    next();
  } catch (error) {
    console.error(error);
    res.json({message:error}).status(400);
  }
};

module.exports = AUTH;

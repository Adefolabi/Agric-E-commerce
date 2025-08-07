const bcrypt = require("bcrypt");

const hashFunction = async (password) => {
  const saltRounds = 10;
  const hashPassword = await bcrypt.hash(password, saltRounds);
  return hashPassword;
};

const searchFunction = async (search ,query) => {
  const regex = new RegExp(search, "i");
  return (query = { $or: [{ name: regex },{ firstName: regex },{ lastName: regex }, { email: regex },{ description: regex }] });
};



module.exports = { hashFunction ,searchFunction};

const bcrypt = require("bcrypt");

const hashFunction = async (password) => {
  const saltRounds = 10;
  const hashPassword = await bcrypt.hash(password, saltRounds);
  return hashPassword;
};

module.exports = { hashFunction };

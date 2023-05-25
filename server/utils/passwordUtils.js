// PasswordUtils.js
const bcrypt = require('bcrypt');

const hashPassword = async (Password) => {
  const saltRounds = 10;
  const salt = await bcrypt.genSalt(saltRounds);
  const hashedPassword = await bcrypt.hash(Password, salt);
  return hashedPassword;
};

module.exports = {
  hashPassword,
};

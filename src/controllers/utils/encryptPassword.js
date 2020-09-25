const bcrypt = require('bcrypt');

const encryptPassword = async (rawPassword) => {
  try {
    const saltRounds = 10;
    const output = await bcrypt.hash(rawPassword, saltRounds);
    return output;
  } catch (error) {
    throw error;
  }
};

module.exports = encryptPassword;
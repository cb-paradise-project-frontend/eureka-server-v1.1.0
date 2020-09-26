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

const comparePassword = async (rawPassword, encryptedPassword) => {
  try {
    const isPasswordMatch = await bcrypt.compare(rawPassword, encryptedPassword);
    if (!isPasswordMatch) {
      return false;
    }
    return true;
  } catch (error) {
    throw error;
  }
}

module.exports = { encryptPassword, comparePassword };
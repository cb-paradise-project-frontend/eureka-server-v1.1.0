const jwt = require('jsonwebtoken');

const jwtSecret = process.env.JWT_SECRET;

const signJWT = async (user) => {
  const payload = {
    user,
  }
  try {
    const token = await jwt.sign(payload, jwtSecret, {expiresIn: '24h'});
    return token;
  } catch (error) {
    throw error;
  }
}

const signForgotPasswordToken = async (email) => {
  const payload = {
    email,
  };
  
  try {
    const token = await jwt.sign(payload, jwtSecret, {expiresIn: '20m'});
    return token;
  } catch(err) {
    throw err;
  }
}

const verifyJWT = async (token) => {
  const decoded = await jwt.verify(token, jwtSecret);
  return decoded;
}

module.exports = { signJWT, signForgotPasswordToken, verifyJWT };

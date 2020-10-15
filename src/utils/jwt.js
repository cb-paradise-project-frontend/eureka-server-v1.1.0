const jwt = require('jsonwebtoken');

const jwtSecret = process.env.JWT_SECRET;

const signJWT = async (userId) => {
  const payload = {
    user: {
      id: userId,
    }
  }
  try {
    const token = await jwt.sign(payload, jwtSecret, {expiresIn: '24h'});
    return token;
  } catch (error) {
    throw error;
  }
}

const verifyJWT = async (token) => {
  const decoded = await jwt.verify(token, jwtSecret);
  return decoded;
}

module.exports = { signJWT, verifyJWT };

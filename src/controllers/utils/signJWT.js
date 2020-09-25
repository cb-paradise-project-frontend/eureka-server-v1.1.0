const jwt = require('jsonwebtoken');

const jwtSecret = process.env.jwtSecret;

const signJWT = async (userId) => {
  const payload = {
    user: {
      id: userId,
    }
  }

  try {
    const token = await jwt.sign(payload, jwtSecret, {expiresIn: 30000});
    return token;
  } catch (error) {
    throw error;
  }
}

module.exports = signJWT;

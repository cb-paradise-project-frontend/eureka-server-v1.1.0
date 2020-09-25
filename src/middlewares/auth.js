const jwt = require('jsonwebtoken');
const { jwtSecret } = process.env;

const auth = async ( req, res, next ) => {
  const token = req.header('x-auth-token');
  if (!token) {
    return res.json('No tohen, authorization denied');
  }

  try {
    const decoded = await jwt.verify(token, jwtSecret);
    req.user = decoded.user;
    next();
  } catch (error) {
    if (error.message == 'invalid token') {
      return res.json('You are not authorized');
    } else
    throw error;
  };
};

module.exports = auth;

require('express-async-errors');
const { signJWT, verifyJWT } = require('./../utils/jwt');

const auth = async ( req, res, next ) => {
  const token = req.header('X-Auth-Token');

  if (!token) {
    return res.status(401).json('No token, authorization denied');
  }

  try {
    const decoded = await verifyJWT(token);
    req.user = decoded.user; //为什么不放在req.body
    console.log(req.user, decoded.user);
    next();
    return;
  } catch (error) {
    if (error.message == 'invalid token') {
      return res.status(403).json('You are not authorized');
    } else
    throw error;
  };
};

module.exports = auth;


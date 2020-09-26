require('express-async-errors');
const { verifyJWT } = require('./../utils/jwt');

const auth = async ( req, res, next ) => {
  const token = req.header('x-auth-token');
  if (!token) {
    return res.json('No tohen, authorization denied');
  }
  try {
    const decoded = await verifyJWT(token);
    req.user = decoded.user;
    console.log(req.user, decoded.user);
    next();
    return;
  } catch (error) {
    if (error.message == 'invalid token') {
      return res.json('You are not authorized');
    } else
    throw error;
  };
};

module.exports = auth;

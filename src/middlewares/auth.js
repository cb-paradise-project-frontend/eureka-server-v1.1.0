require('express-async-errors');
const { signJWT, verifyJWT } = require('./../utils/jwt');

const auth = async ( req, res, next ) => {
  const token = req.header('X-Auth-Token');

  if (!token) {
    return res.status(401).json('No tohen, authorization denied');
  }

  try {
    const decoded = await verifyJWT(token);
    req.user = decoded.user;
    const tokenToSend = (await signJWT(decoded.user)).toString();
    res.status(200).setHeader('X-Auth-Token', tokenToSend);
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

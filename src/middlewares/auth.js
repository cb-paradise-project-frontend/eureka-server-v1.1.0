require('express-async-errors');
const { decode } = require('jsonwebtoken');
const { signJWT, verifyJWT } = require('./../utils/jwt');
const { sendResult, sendError } = require('../utils/sendResponse');

const auth = async ( req, res, next ) => {
  const token = req.header('X-Auth-Token');

  if (!token) {
    return sendError(res, 401, 'No token, access denied');
  }

  try {
    const decoded = await verifyJWT(token);
    req.user = decoded.user;
    const tokenToSend = (await signJWT(decoded.user)).toString();
    res.setHeader('X-Auth-Token', tokenToSend);
    next();
  } catch (error) {
    if (error.message == 'invalid token') {
      return sendError(res, 403, 'You are not authorized');
    } else
    throw error;
  };
};

module.exports = auth;


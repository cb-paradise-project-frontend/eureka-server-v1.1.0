const User = require('./../models/User');
const { encryptPassword, comparePassword } = require('../utils/password');
const { signJWT, signForgotPasswordToken, verifyJWT } = require('../utils/jwt');
const { signUpSchema, logInSchema } = require('../utils/validator');
const HttpError = require('../utils/HttpError');
const { findById } = require('./../models/User');
const { sendResult, sendError } = require('../utils/sendResponse');
const { SESSendEmail } = require('../utils/AWS_SES');

const getUsers = async (req, res) => {
  const users = await User.find().exec();
  if (!users) {
    return sendError(res, 400, 'User not found');
  }
  return sendResult(res, users);
};

const getUserById = async (req, res) => {
  const id = req.params.id;
  const user = await User.findById(id).exec();
  if (!user) {
    return sendError(res, 400, 'User not found');
  }
  return sendResult(res, user);
};


// User register
// Public

const signUp = async (req, res) => {
  const result = await signUpSchema.validateAsync(req.body, {
    abortEarly: false,
    allowUnknown: true,
    stripUnknown: true,
  });

  const { firstName, lastName, email, password } = result;

  const existingUser = await User.findOne({email}).exec();
  if (existingUser) {
    return sendError(res, 409, 'User exists, please try another email');
  }

  const user = new User({ firstName, lastName, email, password });
  user.password = await encryptPassword(password);
  await user.save();

  const userId = user.id;
  const token = await signJWT({ userId, firstName, lastName, email });
  res.set('X-Auth-Token', token);
  return sendResult(res);
};


// User login
// Public

const logIn = async(req, res) => {
  const result = await logInSchema.validateAsync(req.body, {
    abortEarly: false,
    allowUnknown: true,
    stripUnknown: true,
  });

  const { email, password } = result;
  const user = await User.findOne({email}).exec();
  if (!user) {
    return sendError(res, 401, 'Incorrect email or password');
  }

  const encryptedPassword = user.password;
  const isPasswordMatch = await comparePassword(password, encryptedPassword);
  if (!isPasswordMatch) {
    return sendError(res, 401, 'Incorrect email or password');
  }

  const userId = user.id;
  const { firstName, lastName, avatarId } = user;
  const token = await signJWT({ userId, firstName, lastName, email, avatarId });
  return res.header('X-Auth-Token', token).json({message: 'LogIn Succeed'})
};

// User private route demo
// Private
// 以下代码为写auth middleware时的demo，可修改或废弃

const updateUser = async (req, res) => {
  const id = req.params.id;

  const { email, password } = req.body;

  if (req.user.userId.toString() !== id.toString()) {
    return res.json('You are not authorized');
  }

  const updatedUser = await User.findByIdAndUpdate(
    id,
    {email, password},
    {new: true}
  ).exec();

  if (!updatedUser) {
    return res.status(400).json('Update user failed');
  }
  return res.json(updatedUser);
};

const updateUserName = async (req, res) => {
  const { userId } = req.user;
  const { firstName, lastName } = req.body;
  let user = await User.findById(userId).exec();

  if (!user) {
    throw new HttpError(400, 'user not found');
  }

  Object.assign(user, {
    firstName,
    lastName,
  }, { new: true })

  const updatedUserName = await user.save();

  if (!updatedUserName) {
    throw new HttpError(406, 'update user name faild');
  }
  const { email, avatarId } = user;
  const token =  await signJWT({ userId, firstName, lastName, email, avatarId });
  return res.status(202).header('X-Auth-Token', token).json({
    firstName: updatedUserName.firstName,
    lastName: updatedUserName.lastName,
  });
};

const resetPassword = async (req, res) => {
  const { userId } = req.user;
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(userId).exec();
  const passwordMatch = await comparePassword(currentPassword, user.password);

  if (!passwordMatch) {
    return res.status(406).json('your current password is wrong');
  }

  const newEncryptedPassword = await encryptPassword(newPassword);
  // const updatedUser = await user.updateOne({
  //   password: newEncryptedPassword,
  // }, {new: true});
  //以上方法不支持使用 new: true，所以我打算用commonJS原生写法保存
  Object.assign(user, {
    password: newEncryptedPassword,
  }, { new: true });
  
  const updatedUser = await user.save();

  if (!updatedUser) {
    throw new HttpError(406, 'could not reset password')
  }
  res.status(202).json(updatedUser);
};

const sendResetLink = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne(req.body).exec();

  if (!user) {
    throw new HttpError(404, 'email not found');
  }

  const newToken = await signForgotPasswordToken(email);

  const updatedTokn = await user.updateOne({
    token: newToken,
  }, { new: true });

  SESSendEmail(email, newToken);
  res.status(200).json(`${email} received`);
};

const resetPasswordFromLink = async (req, res) => {
  const { password, token } = req.body;

  const { email } = await verifyJWT(token);
  const user = await User.findOne({email: email}).exec();

  if (user.token !== token) throw new HttpError(406, 'token not match or be modified');

  const newEncryptedPassword = await encryptPassword(password);

  Object.assign(user, {
    password: newEncryptedPassword,
    token: null,
  }, { new: true });
  
  const updatedUser = await user.save();
  if (updatedUser) {
    return res.status(200).json('password changed succeeded');
  };
};

const updateAvatar = async (req, res) => {
  const { userId } = req.user;
  const { avatarId } = req.body;
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { avatarId },
    { new: true },
  ).exec();

  if (!updatedUser) {
    throw new HttpError(404, 'change avatar failed');
  }

  return res.status(200).json(updatedUser);
};

// const getAvatar = async (req, res) => {
//   const { userId } = req.user;
//   console.log(userId, 999);
// }

module.exports = { 
  getUsers,
  getUserById,
  signUp,
  logIn,
  updateUser,
  updateUserName,
  resetPassword,
  sendResetLink,
  resetPasswordFromLink,
  updateAvatar,
};

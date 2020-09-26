const User = require('./../models/User');
const { encryptPassword, comparePassword } = require('../utils/password');
const { signJWT } = require('../utils/jwt');
const { authSchema, passwordSchema } = require('../utils/validator');


const getUsers = async (req, res) => {
  const users = await User.find().exec();
  if (!users) {
    return res.status(400).json('Users not found');
  }
  return res.json(users);
};

const getUserById = async (req, res) => {
  const id = req.params.id;
  const user = await User.findById(id).exec();
  if (!user) {
    return res.status(400).json('User not found');
  }
  return res.json(user);
};


// User register
// Public

const addUser = async (req, res) => {
  const result = await authSchema.validateAsync(req.body, {
    abortEarly: false,
    allowUnknown: true,
    stripUnknown: true,
  });

  const{email, password} = result;

  const existingUser = await User.findOne({email}).exec();
  if (existingUser) {
    return res.json('User exists, please try another email');
  }

  const user = new User({ email, password });
  user.password = await encryptPassword(password);
  await user.save();

  const userId = user.id;
  const token = await signJWT(userId);
  return res.json({token});
};


// User login
// Public

const authenticateUser = async(req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({email}).exec();
  if (!user) {
    return res.json('Incorrect email or password');
  }

  const encryptedPassword = user.password;
  const isPasswordMatch = await comparePassword(password, encryptedPassword);
  if (!isPasswordMatch) {
    return res.json('Incorrect email or password');
  }

  const userId = user.id;
  const token = await signJWT(userId);
  return res.json({token});
};


// User private route demo
// Private

const updateUser = async (req, res) => {
  const id = req.params.id;

  const { email, password } = req.body;

  if (req.user.id.toString() !== id.toString()) {
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

module.exports = { getUsers, getUserById, addUser, updateUser, authenticateUser };

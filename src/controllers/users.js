const User = require('./../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const encryptPassword = require('../controllers/utils/encryptPassword');
const signJWT = require('../controllers/utils/signJWT');

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
  const { email, password } = req.body;

  const existingUser = await User.findOne({email}).exec();
  if (existingUser) {
    return res.json('User exists, please sign up with another email');
  }

  try {
    const user = new User({ email, password });
    user.password = await encryptPassword(password);
    await user.save();
    const userId = user.id;
    const token = await signJWT(userId);
    return res.json({token});
  } catch (error) {
    console.log(error.message);
    return res.json('Server error');
  }
};

// User login
// Public

const authenticateUser = async(req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({email}).exec();
  if (!user) {
    return res.json('Incorrect email or password');
  }
  try {
    const encryptedPassword = user.password;
    const checkPasswordMatch = await bcrypt.compare(password, encryptedPassword);
    if (!checkPasswordMatch) {
      return res.json('Incorrect email or password');
    }
    const userId = user.id;
    const token = await signJWT(userId);
    return res.json({token});
  } catch (error) {
    console.log(error.message);
    return res.json('Server error');
  }
};

const updateUser = async (req, res) => {
  const id = req.params.id;
  const { email, password } = req.body;
  console.log(req.user, req.params.id);

  if (req.user.id.toString() !== id.toString()) {
    return res.json('You are not authorized');
  }

  const newUser = await User.findByIdAndUpdate(
    id,
    {email, password},
    {new: true}
  ).exec();

  if (!newUser) {
    return res.status(400).json('Update user failed');
  }
  return res.json(newUser);
};

module.exports = { getUsers, getUserById, addUser, updateUser, authenticateUser };

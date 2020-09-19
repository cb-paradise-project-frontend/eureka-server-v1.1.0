const User = require('./../models/User');

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

const addUser = async (req, res) => {
  const {firstName, lastName, password} = req.body;
  const users = new User({firstName, lastName, password});
  await users.save();
  return res.json(users);
};

const updateUser = async (req, res) => {
  const id = req.params.id;
  const {firstName, lastName, password} = req.body;

  const newUser = await User.findByIdAndUpdate(
    id,
    {firstName, lastName, password},
    {new: true}
  ).exec();

  if (!newUser) {
    return res.status(400).json('Update user failed');
  }
  return res.json(newUser);
};

module.exports = { getUsers, getUserById, addUser, updateUser };

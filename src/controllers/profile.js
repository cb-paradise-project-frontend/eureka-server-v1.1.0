const HttpError = require('../utils/HttpError');
const User = require('../models/User');
const { sendResult } = require('../utils/sendResponse');
const Profile = require('./../models/Profile');

const saveProfile = async (req, res) => {
  const { userId } = req.user;

  const profile = new Profile({
    ...req.body,
    user: userId,
  });

  if (!profile) throw new HttpError(400, 'Invalid profile input');

  const user = await User.findById(userId).exec();

  if (!user) throw new HttpError(404, 'User not found');

  await profile.save();
  
  if (user.profile) {
    await Profile.findByIdAndDelete(user.profile);
  }

  user.profile = profile._id;
  await user.save();

  return sendResult(res, profile);
};

const getProfileByUserId = async (req, res) => {
  const { userId } = req.user;

  const profile = await Profile.find({ user: userId }).exec();
  const user = await User.findById(userId).exec();
  console.log(999, user);

  if (!profile) throw new HttpError(404, 'Profile not found');

  return sendResult(res, profile);
};


// for testing
const getAllProfile = async (req, res) => {
  const profiles = await Profile.find().exec();

  if (!profiles.length) throw new HttpError(404, 'Profiles not found');

  return sendResult(res, profiles);
};

const getAvatarByUserId = async (req, res) => {
  const { userId } = req.user;

  const user = await User.findById(userId).exec();

  return res.status(200).json(user);
}

module.exports = {
  saveProfile,
  getAllProfile,
  getProfileByUserId,
  getAvatarByUserId,
};
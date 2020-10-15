const HttpError = require('../utils/HttpError');
const User = require('../models/User');
const { sendResult } = require('../utils/sendResponse');
const Profile = require('./../models/Profile');

const saveProfile = async (req, res) => {
  const userId = req.body.user;

  const profile = new Profile({
    ...req.body
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
  const { id } = req.params;

  const profile = await Profile.find({ user: id }).exec();

  if (!profile) throw new HttpError(404, 'Profile not found');

  return sendResult(res, profile);
};


// for testing
const getAllProfile = async (req, res) => {
  const profiles = await Profile.find().exec();

  if (!profiles.length) throw new HttpError(404, 'Profiles not found');

  return sendResult(res, profiles);
};

module.exports = {
  saveProfile,
  getAllProfile,
  getProfileByUserId,
};
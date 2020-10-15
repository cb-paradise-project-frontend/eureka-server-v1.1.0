const HttpError = require('../utils/HttpError');
const User = require('../models/User');
const { sendResult } = require('../utils/sendResponse');
const Profile = require('./../models/Profile');

const addProfile = async (req, res) => {
  const { user } = req.body;

  const matchUser = await User.findById(user).exec();

  if (matchUser.profile) throw new HttpError(403, 'Profile already exist');

  const profile = new Profile({
    ...req.body
  });

  if (!profile) throw new HttpError(400, 'Invalid profile input');

  matchUser.profile = profile._id;

  await profile.save();
  await matchUser.save();

  return sendResult(res, profile);
};


// for testing
const getAllProfile = async (req, res) => {
  const profiles = await Profile.find().exec();

  if (!profiles.length) throw new HttpError(404, 'Profiles not found');

  return sendResult(res, profiles);
};

module.exports = {
  addProfile,
  getAllProfile,
};
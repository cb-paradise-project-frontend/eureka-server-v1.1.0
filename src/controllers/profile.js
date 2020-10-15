const HttpError = require('../utils/HttpError');
const { sendResult } = require('../utils/sendResponse');
const Profile = require('./../models/Profile');

const addProfile = async (req, res) => {
  const {
    user,
    accountHolder,
    accountNumber,
    bsb,
    billingAddress,
    birthday,
    mobile,
  } = req.body;

  const profile = new Profile({
    user,
    accountHolder,
    accountNumber,
    bsb,
    billingAddress,
    birthday,
    mobile,
  });

  if (!profile) throw new HttpError(400, 'Invalid profile input');

  await profile.save();

  return sendResult(res, profile);
};


// for testing
const getAllProfile = async () => {
  const profiles = await Profile.find().exec();

  if (!profiles.length) throw new HttpError(404, 'Profiles not found');

  return sendResult(res, profiles);
};

module.exports = {
  addProfile,
  getAllProfile,
};
const Joi = require('joi');

const signUpSchema = Joi.object({
  firstName: Joi.string()
            .required(),
  lastName: Joi.string()
            .required(),
  email: Joi.string()
            .email()
            .lowercase()
            .required(),
  password: Joi.string()
            .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
            .required(),
});

const logInSchema = Joi.object({
  email: Joi.string()
            .email()
            .lowercase()
            .required(),
  password: Joi.string()
            .required(),
});

module.exports = { signUpSchema, logInSchema }

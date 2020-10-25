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
            .pattern(/^(?=.*[A-Z])(?=.*[\W])(?=.*[0-9])(?=.*[a-z]).{8,16}$/)
            .required(),
  confirmPassword: Joi.ref('password'),
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

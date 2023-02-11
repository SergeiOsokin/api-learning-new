const { celebrate, Joi } = require('celebrate');

const emailValidation = Joi.string().required()
  .regex(/[a-zA-Z0-1\W\D]{1,}@[[a-zA-Z0-1\W\D]{1,}\.[a-zA-Z]{2,3}/i);

const validationCreateUser = celebrate({
  body: Joi.object().keys({
    email: emailValidation,
    password: Joi.string().required().min(6).max(30),
  }).unknown(true),
});

const validationLogin = celebrate({
  body: Joi.object().keys({
    email: emailValidation,
    password: Joi.string().required().min(6).max(30),
  }).unknown(true),
});

const validationGetUser = celebrate({
  params: Joi.object().keys({
    me: Joi.string().alphanum().max(30),
  }).unknown(true),
  headers: Joi.object().keys({
    cookie: Joi.string().required(),
  }).unknown(true),
});

module.exports = {
  validationCreateUser,
  validationLogin,
  validationGetUser,
};

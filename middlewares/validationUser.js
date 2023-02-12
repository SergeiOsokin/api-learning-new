const { celebrate, Joi } = require('celebrate');

const emailValidation = Joi.string().required()
  .regex(/[a-zA-Z0-1\W\D]{1,}@[[a-zA-Z0-1\W\D]{1,}\.[a-zA-Z]{2,3}/i);

const validationCreateUser = celebrate({
  body: Joi.object().keys({
    email: emailValidation,
    password: Joi.string().required().min(6).max(30),
  }).unknown(true),
}, {
  abortEarly: false,
  messages: {
    'string.max': '{#label} Максимум {#limit} символов',
    'string.min': '{#label} Минимум {#limit} символа',
    'string.required': '{#label} Обязательный параметр',
    'string.pattern.base': '{#label} Некорректный email',
  },
});

const validationLogin = celebrate({
  body: Joi.object().keys({
    email: emailValidation,
    password: Joi.string().required().min(6).max(30),
  }).unknown(true),
}, {
  abortEarly: false,
  messages: {
    'string.max': '{#label} Максимум {#limit} символов',
    'string.min': '{#label} Минимум {#limit} символа',
    'string.required': '{#label} Обязательный параметр',
    'string.pattern.base': '{#label} Некорректный email',
  },
});

const validationGetUser = celebrate({
  params: Joi.object().keys({
    me: Joi.string().alphanum().max(30),
  }).unknown(true),
  headers: Joi.object().keys({
    cookie: Joi.string().required(),
  }).unknown(true),
}, {
  abortEarly: false,
  messages: {
    'string.max': '{#label} Максимум {#limit} символов',
    'string.required': '{#label} Обязательный параметр',
  },
});

module.exports = {
  validationCreateUser,
  validationLogin,
  validationGetUser,
};

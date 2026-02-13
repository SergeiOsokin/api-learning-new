const { celebrate, Joi } = require('celebrate');

const emailValidation = Joi.string().required()
  .regex(/[a-zA-Z0-9\W\D]{1,}@[[a-zA-Z0-1\W\D]{1,}\.[a-zA-Z]{2,3}/i);

const validationLogin = celebrate({
  body: Joi.object().keys({
    form: Joi.string().required().min(6),
  }).unknown(true),
}, {
  abortEarly: false,
  messages: {
    'string.min': '{#label} Минимум {#limit} символа',
    'string.required': '{#label} Обязательный параметр',
    'string.pattern.base': '{#label} Некорректный email',
  },
});

const validationGetSmth = celebrate({
  body: Joi.object().keys({
    form: {
      email: emailValidation,
      token: Joi.string().required().min(6),
    },
  }).unknown(true),
}, {
  abortEarly: false,
  messages: {
    'string.max': '{#label} Максимум {#limit} символов',
    'string.required': '{#label} Обязательный параметр',
  },
});

module.exports = {
  validationLogin,
  validationGetSmth,
};

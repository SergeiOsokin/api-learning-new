const { celebrate, Joi } = require('celebrate');

const validationGetHomeworkThemes = celebrate({
  headers: Joi.object().keys({
    cookie: Joi.string().required(),
  }).unknown(true),
}, {
  abortEarly: false,
  messages: {
    'string.required': '{#label} Обязательный параметр',
  },
});

const validationGetHomework = celebrate({
  headers: Joi.object().keys({
    cookie: Joi.string().required(),
  }).unknown(true),
}, {
  abortEarly: false,
  messages: {
    'string.required': '{#label} Обязательный параметр',
  },
});

module.exports = {
  validationGetHomeworkThemes,
  validationGetHomework,
};

const { celebrate, Joi } = require('celebrate');

const validationCreateTask = celebrate({
  body: Joi.object().keys({
    words: Joi.string().required().max(500),
    rules: Joi.string().required().max(500),
    translate: Joi.string().required().max(500),
    read: Joi.string().required().max(500),
    other: Joi.string().required().max(500),
  }).unknown(true),
}, {
  abortEarly: false,
  messages: {
    'string.max': '{#label} Максимум {#limit} символов',
    'string.min': '{#label} Минимум {#limit} символа',
    'string.required': '{#label} Обязательный параметр',
  },
});

module.exports = {
  validationCreateTask,
};

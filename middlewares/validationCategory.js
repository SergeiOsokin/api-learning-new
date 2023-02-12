const { celebrate, Joi } = require('celebrate');

const cyrillicValidation = Joi.string().required().min(1).max(30)
  .regex(/^[а-яё]+$/i);

const validationGetCategories = celebrate({
  headers: Joi.object().keys({
    cookie: Joi.string().required(),
  }).unknown(true),
}, {
  abortEarly: false,
  messages: {
    'string.required': '{#label} Обязательный параметр',
  },
});

const validationAddCategory = celebrate({
  body: Joi.object().keys({
    categoryWord: cyrillicValidation,
  }).unknown(true),
  headers: Joi.object().keys({
    cookie: Joi.string().required(),
  }).unknown(true),
}, {
  abortEarly: false,
  messages: {
    'string.pattern.base': '{#label} Укажите на русском языке',
    'string.required': '{#label} Обязательный параметр',
  },
});

const validationDeleteCategory = celebrate({
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
  validationAddCategory,
  validationGetCategories,
  validationDeleteCategory,
};

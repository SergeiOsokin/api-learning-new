const { celebrate, Joi } = require('celebrate');

const idValidation = Joi.string().required().max(24)
  .regex(/^[0-9]+$/i);

const cyrillicValidation = Joi.string().required().min(1).max(30)
  .pattern(new RegExp(/^[а-яё\s]+$/i));

const latinValidation = Joi.string().required().min(1).max(30)
  .regex(/^[a-z\s]+$/i);

const validationGetWords = celebrate({
  headers: Joi.object().keys({
    cookie: Joi.string().required(),
  }).unknown(true),
});

const validationAddWord = celebrate({
  body: Joi.object().keys({
    russianWord: cyrillicValidation,
    foreignWord: latinValidation,
    categoryWord: idValidation,
  }).unknown(true),
  headers: Joi.object().keys({
    cookie: Joi.string().required(),
  }).unknown(true),
}, {
  abortEarly: false,
  messages: {
    'string.max': '{#label} Максимум {#limit} символов',
    'string.min': '{#label} Минимум {#limit} символа',
    'string.required': '{#label} Обязательный параметр',
    'string.pattern.base': '{#label} Измените язык',
  },
});

const validationPatchWord = celebrate({
  body: Joi.object().keys({
    russianWord: cyrillicValidation,
    foreignWord: latinValidation,
    categoryWordId: idValidation,
  }).unknown(true),
  headers: Joi.object().keys({
    cookie: Joi.string().required(),
  }).unknown(true),
}, {
  abortEarly: false,
  messages: {
    'string.max': '{#label} Максимум {#limit} символов',
    'string.min': '{#label} Минимум {#limit} символа',
    'string.required': '{#label} Обязательный параметр',
    'string.pattern.base': '{#label} Измените язык',
  },
});

const validationDeleteWord = celebrate({
  params: Joi.object().keys({
    wordId: idValidation,
  }).unknown(true),
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
  validationGetWords,
  validationAddWord,
  validationDeleteWord,
  validationPatchWord,
};

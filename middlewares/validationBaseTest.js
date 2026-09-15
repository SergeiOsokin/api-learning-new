const { celebrate, Joi } = require('celebrate');

const idValidation = Joi.string().required().max(24)
  .regex(/^[0-9]+$/i);

const cyrillicValidation = Joi.string().required().min(1).max(30)
  .pattern(new RegExp(/^[а-яё\s,()-]+$/i));

const latinValidation = Joi.string().required().min(1).max(30)
  .regex(/^[a-z\s,()-]+$/i);

const validationGetTest = celebrate({
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
    'string.pattern.base': 'Проверьте язык для поля {#label}. Доступные символы: , () -',
  },
});

module.exports = {
  validationGetTest,
};

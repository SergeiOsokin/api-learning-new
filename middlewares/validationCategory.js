const { celebrate, Joi } = require('celebrate');

const objectIdValidation = Joi.string().required().max(24)
  .regex(/^[0-9]+$/i);

  const cyrillicValidation = Joi.string().required().min(1).max(30)
  .regex(/^[а-яё]+$/i);

const validationGetCategories = celebrate({
  headers: Joi.object().keys({
    cookie: Joi.string().required(),
  }).unknown(true),
});

const validationAddCategory = celebrate({
  body: Joi.object().keys({
    categoryWord: cyrillicValidation
  }).unknown(true),
  headers: Joi.object().keys({
    cookie: Joi.string().required(),
  }).unknown(true),
});

module.exports = {
  validationAddCategory,
  validationGetCategories,
};

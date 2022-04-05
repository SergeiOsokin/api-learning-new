const { celebrate, Joi } = require('celebrate');

const objectIdValidation = Joi.string().required().max(24)
  .regex(/^[0-9]+$/i);

const cyrillicValidation = Joi.string().required().min(1).max(30)
  .regex(/^[а-яё]+$/i);

  const latinValidation = Joi.string().required().min(1).max(30)
  .regex(/^[a-z]+$/i);

const validationGetWords = celebrate({
  headers: Joi.object().keys({
    cookie: Joi.string().required(),
  }).unknown(true),
});

const validationAddWord = celebrate({
  body: Joi.object().keys({
    russianWord: cyrillicValidation,
    foreignWord: latinValidation,
    // pathSpeech: Joi.string().required().min(1),
    categoryWord: objectIdValidation,
  }).unknown(true),
  headers: Joi.object().keys({
    cookie: Joi.string().required(),
  }).unknown(true),
});

const validationPatchWord = celebrate({
  body: Joi.object().keys({
    russianWord: cyrillicValidation,
    foreignWord: latinValidation,
    // pathSpeech: Joi.string().required().min(1),
    categoryWordId: objectIdValidation,
  }).unknown(true),
  headers: Joi.object().keys({
    cookie: Joi.string().required(),
  }).unknown(true),
});

const validationDeleteWord = celebrate({
  params: Joi.object().keys({
    wordId: objectIdValidation,
  }).unknown(true),
  headers: Joi.object().keys({
    cookie: Joi.string().required(),
  }).unknown(true),
});

module.exports = {
  validationGetWords,
  validationAddWord,
  validationDeleteWord,
  validationPatchWord
};

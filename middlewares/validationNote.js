const { celebrate, Joi } = require('celebrate');

const objectIdValidation = Joi.string().required().max(24)
  .regex(/^[0-9]+$/i);

const validationGetNotes = celebrate({
  headers: Joi.object().keys({
    cookie: Joi.string().required(),
  }).unknown(true),
}, {
  abortEarly: false,
  messages: {
    'string.required': '{#label} Обязательный параметр',
  },
});

const validationAddNote = celebrate({
  body: Joi.object().keys({
    theme: Joi.string().required().min(1).max(20),
    text: Joi.string().required().min(1).max(1200),
    example: Joi.string().required().min(1).max(150),
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
  },
});

const validationPatchNotes = celebrate({
  params: Joi.object().keys({
    noteId: Joi.number().required(),
  }).unknown(true),
  body: Joi.object().keys({
    theme: Joi.string().required().min(1).max(20),
    text: Joi.string().required().min(1).max(1200),
    example: Joi.string().required().min(5).max(150),
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
  },
});

const validationDeleteNotes = celebrate({
  params: Joi.object().keys({
    noteId: objectIdValidation,
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
  },
});

module.exports = {
  validationGetNotes,
  validationAddNote,
  validationPatchNotes,
  validationDeleteNotes,
};

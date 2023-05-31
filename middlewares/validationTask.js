const { celebrate, Joi } = require('celebrate');

const validationCreateTask = celebrate({
  body: Joi.object().keys({
    theme: Joi.string().required().max(100),
    words: Joi.string().required().max(500),
    rules: Joi.string().required().max(500),
    translate: Joi.string().required().max(500),
    read: Joi.string().required().max(500),
    other: Joi.string().required().max(500),
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

const validationPatchTask = celebrate({
  params: Joi.object().keys({
    taskId: Joi.number().required(),
  }).unknown(true),
  body: Joi.object().keys({
    theme: Joi.string().required().max(100),
    words: Joi.string().required().max(500),
    rules: Joi.string().required().max(500),
    translate: Joi.string().required().max(500),
    read: Joi.string().required().max(500),
    other: Joi.string().required().max(500),
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

const validationGetTaskThemesTeacher = celebrate({
  headers: Joi.object().keys({
    cookie: Joi.string().required(),
  }).unknown(true),
}, {
  abortEarly: false,
  messages: {
    'string.required': '{#label} Обязательный параметр',
  },
});

const validationGetTaskTeacher = celebrate({
  params: Joi.object().keys({
    taskId: Joi.number().required(),
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

const validationDeleteTask = celebrate({
  params: Joi.object().keys({
    taskId: Joi.number().required(),
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
  validationCreateTask,
  validationGetTaskThemesTeacher,
  validationGetTaskTeacher,
  validationPatchTask,
  validationDeleteTask,
};

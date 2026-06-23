const { celebrate, Joi } = require('celebrate');

const validationCreateArticle = celebrate({
  body: Joi.object().keys({
    theme: Joi.string().required().max(50),
    category: Joi.string().required().max(50),
    text_art: Joi.string().required().max(2000),
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

const validationPatchArticle = celebrate({
  params: Joi.object().keys({
    articleId: Joi.number().required(),
  }).unknown(true),
  body: Joi.object().keys({
    theme: Joi.string().required().max(50),
    category: Joi.string().required().max(50),
    text_art: Joi.string().required().max(2000),
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

const validationPostArticle = celebrate({
  params: Joi.object().keys({
    articleId: Joi.number().required(),
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

const validationGetArticles = celebrate({
  headers: Joi.object().keys({
    cookie: Joi.string().required(),
  }).unknown(true),
}, {
  abortEarly: false,
  messages: {
    'string.required': '{#label} Обязательный параметр',
  },
});

const validationGetArticle = celebrate({
  params: Joi.object().keys({
    articleId: Joi.number().required(),
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

const validationDeleteArticle = celebrate({
  params: Joi.object().keys({
    articleId: Joi.number().required(),
  }).unknown(true),
  headers: Joi.object().keys({
    cookie: Joi.string().required(),
  }).unknown(true),
}, {
  abortEarly: false,
  messages: {
    'string.required': '{#label} Обязательный параметр',
    'number.required': '{#label} Обязательный параметр',
  },
});

const validationLikeArticle = celebrate({
  params: Joi.object().keys({
    articleId: Joi.number().required(),
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
  validationCreateArticle,
  validationGetArticles,
  validationGetArticle,
  validationPatchArticle,
  validationDeleteArticle,
  validationPostArticle,
  validationLikeArticle,
};

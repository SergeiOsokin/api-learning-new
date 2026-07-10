const { celebrate, Joi } = require('celebrate');

const latinValidation = Joi.string().required().min(10).max(2000)
  .regex(/^[\w\s,:%'"/.()!?-]+$/i);

const validationCreateArticle = celebrate({
  body: Joi.object().keys({
    theme: Joi.string().required().max(50),
    category: Joi.string().required().max(50),
    textArt: latinValidation,
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
    'string.pattern.base': 'Проверьте текст статьи - разрешена только латиница и символы: ,.()!?-:%"',
  },
});

const validationPatchArticle = celebrate({
  params: Joi.object().keys({
    articleId: Joi.number().required(),
  }).unknown(true),
  body: Joi.object().keys({
    theme: Joi.string().required().max(50),
    category: Joi.string().required().max(50),
    textArt: latinValidation,
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
    'string.pattern.base': 'Проверьте текст статьи - разрешена только латиница и символы: ,.()!?-:%"',
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

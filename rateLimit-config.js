const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 20 * 60 * 1000, // за 15 минут
  max: 100, // можно совершить максимум 100 запросов с одного IP
  message: 'Слишком много запросов, поторите через 15 минут',
});

module.exports = {
  limiter,
};

const jwt = require('jsonwebtoken');
const { BadToken, NotHeaders } = require('../errors/errors');
const { JWT_SECRET } = require('../config');
const { needHeader, badToken } = require('../const');

const auth = (req, res, next) => {
  const cookie = req.cookies.jwt;
  if (!cookie) { // проверяем что заголовок есть
    throw new NotHeaders(needHeader);
  }
  const token = cookie; // тут извлекаем токен
  let payload;// так сделали из-за области видимости

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    throw new BadToken(badToken);
  }
  req.user = payload; // записываем пейлоуд в объект запроса
  return next();
};

module.exports = { auth };

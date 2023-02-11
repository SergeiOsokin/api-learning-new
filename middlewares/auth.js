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

  // try {
  //   const token = req.headers.authorization.split(' ')[1];
  //   if (!token) {
  //     throw new NotHeaders(needHeader);
  //     // return res.status(401).json({ message: 'Не авторизованы' });
  //   }
  //   const payload = jwt.verify(token, JWT_SECRET); // раскодируем токен
  //   req.user = payload; // записываем айди пользовавателя "в запрос"
  //   next();
  // } catch (e) {
  //   throw new BadToken(badToken);
  // }
};

module.exports = { auth };

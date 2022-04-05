const bcrypt = require('bcryptjs');
const { BadAuthData } = require('../errors/errors');
const { notFoundUserEmail, wrongPasswordOrLogin } = require('../const');

const findUserByCredentials = (email, password) => this.findOne({ email }).select('+password') // добавляем, чтобы был хэш, если аторизация норм.
  .then((usercard) => {
    if (!usercard) {
      throw new BadAuthData(notFoundUserEmail);
    }
    return bcrypt.compare(password, usercard.password)
      .then((matched) => {
        if (!matched) {
          throw new BadAuthData(wrongPasswordOrLogin);
        }
        return usercard;
      });
  });

module.exports = { findUserByCredentials };

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { Client } = require('pg');
const { notFoundUserEmail, wrongPasswordOrLogin } = require('../const');
const { BadAuthData } = require('../errors/errors');
// const { findUserByCredentials } = require('../models/user');
// const { NotFound } = require('../errors/errors');
const { alreadyExist, regSuccsessful } = require('../const');
const { DATABASE_URL } = require('../config');

const { JWT_SECRET } = require('../config');

const login = (req, res, next) => {
  const client = new Client(DATABASE_URL);
  client.connect();// подключаемся к БД
  const { email, password: passwordCame } = req.body;
  client.query('SELECT id, email, password from users where email=$1', [email])
    .then((select) => {
      if (!select.rows.length) {
        client.end();
        throw new BadAuthData(notFoundUserEmail);
      }
      const { id } = select.rows[0];
      const hash = select.rows[0].password;

      bcrypt.compare(passwordCame, hash)
        .then((matched) => {
          if (!matched) {
            throw new BadAuthData(wrongPasswordOrLogin);
          }
          const token = jwt.sign({ _id: id },
            JWT_SECRET,
            { expiresIn: '7d' });
          res.cookie('jwt', token, { domain: '', httpOnly: true, maxAge: 604800000 })
            .send({ user: id })
            .end();
          client.end();
        })
        .catch(next);
    })
    .catch((err) => {
      client.end();
      next(err);
    });
};

const createUser = (req, res, next) => {
  const client = new Client(DATABASE_URL);
  client.connect();// подключаемся к БД
  const {
    email, password,
  } = req.body;
  client.query('SELECT email from users where email=$1', [email])
    .then((select) => {
      if (select.rows.length >= 1) {
        res.send({ message: alreadyExist });
        return client.end();
      }
      // client.connect();// подключаемся к БД
      bcrypt.hash(password, 10)
        .then((hash) => {
          client
            .query('INSERT INTO users (email, password) values ($1, $2)', [email, hash]) // записываем информацию о пользователе
            .then(() => {
              res.send({ message: regSuccsessful });
            })
            .catch((err) => {
              next(err);
            })
            .then(() => client.end());
        })
        .catch(next);
    })
    .catch((err) => {
      client.end();
      next(err);
    });
};

module.exports = {
  createUser, login,
};

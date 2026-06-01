const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { Client } = require('pg');
const { notFoundUserEmail, wrongPasswordOrLogin } = require('../const');
const { BadAuthData, NotFound } = require('../errors/errors');
const { getPassword } = require('../middlewares/genPassword');
// const { findUserByCredentials } = require('../models/user');
// const { NotFound } = require('../errors/errors');
const { alreadyExist, regSuccsessful, resetPass } = require('../const');
const { DATABASE_URL } = require('../config');

const { JWT_SECRET } = require('../config');
const { sendEmail } = require('../middlewares/email');

const login = (req, res, next) => {
  const client = new Client(DATABASE_URL);
  client.connect();// подключаемся к БД
  const { email, password: passwordCame } = req.body;
  client.query('SELECT id, email, password from users where email=$1', [email.toLowerCase()])
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
          res.cookie('jwt', token, {
            domain: '',
            httpOnly: true,
            SameSite: 'None',
            Secure: true,
          })
            .send({ user: email })
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

const resetPassword = (req, res, next) => {
  const client = new Client(DATABASE_URL);
  client.connect();// подключаемся к БД
  const { email } = req.body;
  client.query('SELECT email from users where email=$1', [email.toLowerCase()])
    .then((select) => {
      if (!select.rows.length) {
        client.end();
        throw new NotFound(notFoundUserEmail);
      }
      const pass = getPassword(10);
      console.log(pass);
      bcrypt.hash(pass, 10)
        .then((hash) => {
          client
            .query('UPDATE users SET password = ($1) WHERE email=($2)', [hash, email]) // обновляем пароль
            .then(() => {
              sendEmail(email, 'Сброс пароля learnew', `Ваш новый пароль ${pass}`);
              res.send({ message: `${resetPass} ${email}` });
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

const createUser = (req, res, next) => {
  const client = new Client(DATABASE_URL);
  client.connect();// подключаемся к БД
  const {
    email, password,
  } = req.body;
  client.query('SELECT email from users where email=$1', [email.toLowerCase()])
    .then((select) => {
      if (select.rows.length >= 1) {
        res.send({ message: alreadyExist });
        client.end();
      }
      // client.connect();// подключаемся к БД
      bcrypt.hash(password, 10)
        .then((hash) => {
          client
            .query('INSERT INTO users (email, password) values ($1, $2)', [email.toLowerCase(), hash]) // записываем информацию о пользователе
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

const getUser = (req, res, next) => {
  const client = new Client(DATABASE_URL);
  client.connect();// подключаемся к БД

  client.query('SELECT * from users')
    .then((select) => {
      res.send({ select });
      return client.end();
    })
    .catch((err) => {
      client.end();
      next(err);
    });
};

module.exports = {
  createUser, login, getUser, resetPassword,
};

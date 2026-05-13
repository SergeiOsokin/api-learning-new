const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { Client } = require('pg');
const { notFoundUserEmail, wrongPasswordOrLogin, newPass, wrongPassword, problemPassword } = require('../const');
const { BadAuthData, NotFound } = require('../errors/errors');
const { getPassword } = require('../middlewares/genPassword');
const { alreadyExist, regSuccsessful, resetPass } = require('../const');
const { DATABASE_URL } = require('../config');

const { JWT_SECRET } = require('../config');

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

const newPassword = (req, res, next) => {
  const userId = req.user._id;
  const client = new Client(DATABASE_URL);
  client.connect();// подключаемся к БД
  const {
    email, passwordOld, passwordNew,
  } = req.body;

  client.query('SELECT * from users where id=$1', [userId])
    .then((select) => {
      if (!select.rows.length) {
        client.end();
        throw new NotFound(notFoundUserEmail);
      }

      const hash = select.rows[0].password;
      // проверяем пароль
      bcrypt.compare(passwordOld, hash)
        .then((matched) => {
          if (!matched) {
            client.end();
            throw new BadAuthData(wrongPassword);
          }
          // сохраняем новый пароль
          bcrypt.hash(passwordNew, 10)
            .then((newHash) => {
              client
                .query('UPDATE users SET password = ($2) WHERE id=($1)', [userId, newHash]) // записываем информацию о пользователе
                .then((result) => {
                  if (result.rowCount) {
                    res.send({ message: newPass, status: true });
                  } else {
                    res.send({ error: problemPassword, status: false });
                  }
                })
                .catch((err) => {
                  next(err);
                })
                .then(() => client.end());
            })
            .catch(next);
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

const genToken = (req, res, next) => {
  const userId = req.user._id;
  const client = new Client(DATABASE_URL);
  client.connect();// подключаемся к БД

  client
    .query('update users set token = password where users.id = ($1)', [userId])
    .then(() => {
      client
        .query('select token from users where id = ($1)', [userId])
        .then((result) => {
          res.send(result.rows[0]);
          client.end();
        });
    })
    .catch((err) => {
      client.end();
      next(err);
    });
};

const genSentence = (req, res, next) => {
  const userId = req.user._id;
  const { theme, category } = req.body;


  const client = new Client(DATABASE_URL);
  client.connect();// подключаемся к БД

  client
    .query(
      `SELECT category_word.category, words.foreign_word
        FROM words
        JOIN category_word ON category_word.id = words.category_word_id
        WHERE words.user_id = ($1) AND category_word.id = ($2)`, [userId, category],
    )
    .then((result) => {
      res.send(result.rows);
      client.end();
    })
    .catch((err) => {
      client.end();
      next(err);
    });
};

module.exports = {
  createUser, login, genToken, genSentence, newPassword,
};

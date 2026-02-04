const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { Client } = require('pg');
const { notFoundUserEmail, wrongPasswordOrLogin } = require('../const');
const { notWords } = require('../const');
const { BadAuthData, NotFound } = require('../errors/errors');
const { getPassword } = require('../middlewares/genPassword');
// const { findUserByCredentials } = require('../models/user');
// const { NotFound } = require('../errors/errors');
const { alreadyExist, regSuccsessful, resetPass } = require('../const');
const { DATABASE_URL } = require('../config');

const { JWT_SECRET } = require('../config');
const { sendEmail } = require('../middlewares/email');

const loginTlg = (req, res, next) => {
  const client = new Client(DATABASE_URL);
  client.connect();// подключаемся к БД
  const { form } = req.body;
  // console.log(req.body);
  client.query('SELECT id, email, password from users where token=$1', [req.body.form])
    .then((select) => {
      console.log(select)
      if (!select.rows.length) {
        client.end();
        throw new BadAuthData(notFoundUserEmail);
      }
      const { id } = select.rows[0];
      const tokenDb = select.rows[0].token;

      res.send({ message: 'Отлично, мы вас нашли!', email: select.rows[0].email });

      // bcrypt.compare(form, tokenDb)
      //   .then((matched) => {
      //     if (!matched) {
      //       throw new BadAuthData(wrongPasswordOrLogin);
      //     }

      //     res.send('good token');
      //     client.end();
      //   })
      //   .catch(next);
    })
    .catch((err) => {
      console.log('error ' + err);
      client.end();
      next(err);
    });
};

const getWords = (req, res, next) => {

  const sqlReq2 = `
  SELECT words.id, words.foreign_word, words.russian_word, words.user_id
  FROM words
  WHERE words.user_id = (select id from users where email = ($1) and token = ($2))`;

  // const userId = req.user._id;
  const { token, email } = req.body.form;

  // console.log(req.body.form)

  const client = new Client(DATABASE_URL);
  client.connect();// подключаемся к БД

  client.query(sqlReq2, [email, token])
    // eslint-disable-next-line consistent-return
    .then((result) => {
      if (result.rowCount === 0) return res.send({ message: notWords, data: [] });
      res.send({ data: result.rows, status: 200 });
      client.end();
    })
    .catch((err) => {
      client.end();
      next(err);
    });
};

module.exports = {
  loginTlg, getWords,
};

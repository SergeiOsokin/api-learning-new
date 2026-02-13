const { Client } = require('pg');
const { notWords, tokenError } = require('../const');
const { BadAuthData } = require('../errors/errors');
const { DATABASE_URL } = require('../config');

const loginTlg = (req, res, next) => {
  const client = new Client(DATABASE_URL);
  client.connect();// подключаемся к БД

  client.query('SELECT id, email, password from users where token=$1', [req.body.form])
    .then((select) => {
      if (!select.rows.length) {
        client.end();
        throw new BadAuthData(tokenError);
      }

      res.send({ message: 'Все отлично! Чего желаете?', email: select.rows[0].email });
    })
    .catch((err) => {
      // eslint-disable-next-line no-console
      console.log(`error ${err}`);
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
      if (result.rowCount === 0) return res.send({ error: notWords, data: [] });
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

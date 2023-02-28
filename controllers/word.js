const { Client } = require('pg');
const { DATABASE_URL } = require('../config');
const { notWords } = require('../const');
// const { PermissionError, ArticleNotExist } = require('../errors/errors');
// const { dataNotFound, permissionText } = require('../const');

const getWords = (req, res, next) => {
  const sqlReq = 'SELECT words.id, words.foreign_word, words.russian_word, words.category_word_id, category_word.category FROM words JOIN category_word ON category_word.id = words.category_word_id AND words.user_id = ($1);';
  const userId = req.user._id;
  const client = new Client(DATABASE_URL);
  client.connect();// подключаемся к БД
  client.query(sqlReq, [userId])
    // eslint-disable-next-line consistent-return
    .then((result) => {
      if (result.rowCount === 0) return res.send({ message: notWords, data: [] });
      res.send({ data: result.rows });
      client.end();
    })
    .catch((err) => {
      client.end();
      next(err);
    });
};

const patchWord = (req, res, next) => {
  const {
    id, russianWord, foreignWord, categoryWordId,
  } = req.body;
  const client = new Client(DATABASE_URL);
  client.connect();// подключаемся к БД

  client
    .query('select foreign_word from words where foreign_word = ($1)', [foreignWord])
    .then((result) => {
      if (result.rowCount !== 0) {
        res.send({ message: 'У вас уже есть это слово на инстранном' });
        client.end();
        return;
      }
      client
        .query('UPDATE words SET foreign_word = ($1), russian_word = ($2), category_word_id = ($3) WHERE id=($4)', [foreignWord, russianWord, categoryWordId, id])
        .then(() => {
          res.send({ message: 'Успешно изменено' });
          client.end();
        })
        .catch((err) => {
          client.end();
          next(err);
        });
    })
    .catch((err) => {
      client.end();
      next(err);
    });
};

const addWord = (req, res, next) => {
  const word = req.body;
  const userId = req.user._id;
  const client = new Client(DATABASE_URL);
  client.connect();// подключаемся к БД

  client
    .query('select foreign_word from words where foreign_word = ($1)', [word.foreignWord])
    .then((result) => {
      if (result.rowCount !== 0) {
        res.send({ message: 'У вас уже есть это слово на инстранном' });
        client.end();
        return;
      }
      client
        .query('INSERT INTO words (foreign_word, russian_word, user_id, category_word_id) VALUES ($1, $2, $3, $4)', [word.foreignWord, word.russianWord, userId, word.categoryWord])
        .then(() => {
          res.send({ message: 'Слово добавлено' });
          client.end();
        })
        .catch((err) => {
          client.end();
          next(err);
        });
    })
    .catch((err) => {
      client.end();
      next(err);
    });
};

const deleteWord = (req, res, next) => {
  const client = new Client(DATABASE_URL);
  client.connect();// подключаемся к БД
  client
    .query('DELETE FROM words WHERE id = ($1)', [req.params.wordId])
    .then(() => {
      res.send({ message: 'Слово удалено' });
      client.end();
    })
    .catch((err) => {
      client.end();
      next(err);
    });
};

module.exports = {
  getWords, patchWord, addWord, deleteWord,
};

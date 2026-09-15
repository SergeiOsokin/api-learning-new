const { Client } = require('pg');
const { DATABASE_URL } = require('../config');
const { notTest } = require('../const');
// const { PermissionError, ArticleNotExist } = require('../errors/errors');
// const { dataNotFound, permissionText } = require('../const');

const getTest = (req, res, next) => {
  const sqlReq = `
  SELECT *
  FROM base_test
  WHERE theme = ($1)
  ORDER BY question_rank`;

  // const userId = req.user._id;
  const { theme } = req.params;

  const client = new Client(DATABASE_URL);
  client.connect();// подключаемся к БД
  client.query(sqlReq, [theme])
    // eslint-disable-next-line consistent-return
    .then((result) => {
      if (result.rowCount === 0) return res.send({ message: notTest, data: [] });
      res.set({ 'Cache-Control': 'max-age=6000, immutable, private' }).send({ data: result.rows });
      client.end();
    })
    .catch((err) => {
      client.end();
      next(err);
    });
};

// const addWord = (req, res, next) => {
//   const word = req.body;
//   const userId = req.user._id;
//   const client = new Client(DATABASE_URL);
//   client.connect();// подключаемся к БД

//   client
//     .query('select foreign_word from words where foreign_word = ($1) and user_id = ($2)', [word.foreignWord, userId])
//     .then((result) => {
//       if (result.rowCount !== 0) {
//         res.send({ error: 'У вас уже есть это слово на инстранном' });
//         client.end();
//         return;
//       }
//       client
//         .query('INSERT INTO words (foreign_word, russian_word, user_id, category_word_id) VALUES ($1, $2, $3, $4)', [word.foreignWord, word.russianWord, userId, word.categoryWord])
//         .then(() => {
//           res.send({ message: 'Слово добавлено' });
//           client.end();
//         })
//         .catch((err) => {
//           client.end();
//           next(err);
//         });
//     })
//     .catch((err) => {
//       client.end();
//       next(err);
//     });
// };

module.exports = {
  getTest,
};

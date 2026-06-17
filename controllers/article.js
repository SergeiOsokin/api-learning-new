const { Client } = require('pg');
const { DATABASE_URL } = require('../config');

const createArticle = (req, res, next) => {
  const article = req.body;
  const userId = req.user._id;
  const client = new Client(DATABASE_URL);
  client.connect();// подключаемся к БД

  client
    .query(
      'INSERT INTO article (user_id, image, theme, category, text_art) VALUES ($1, $2, $3, $4, $5)',
      [userId, article.image, article.theme, article.category, article.text_art],
    )
    .then(() => {
      res.send({ message: 'Статья создана', status: 200 });
      client.end();
    })
    .catch((err) => {
      client.end();
      next(err);
    });
};

const getArticlesAuthor = (req, res, next) => {
  const userId = req.user._id;
  const client = new Client(DATABASE_URL);
  client.connect();// подключаемся к БД

  client
    .query(
      `SELECT *
        FROM article
        WHERE user_id = ($1)
        ORDER BY date_create`, [userId],
    )
    .then((result) => {
      res.send({ data: result.rows, status: 200 });
      client.end();
    })
    .catch((err) => {
      client.end();
      next(err);
    });
};

const getArticleAuthor = (req, res, next) => {
  const userId = req.user._id;
  const { articleId } = req.params;
  const client = new Client(DATABASE_URL);
  client.connect();// подключаемся к БД

  client
    .query(
      `SELECT *
        FROM article
        WHERE user_id = ($1) and id = ($2)`, [userId, articleId],
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

const patchArticle = (req, res, next) => {
  const userId = req.user._id;
  const article = req.body;
  const { articleId } = req.params;
  // const date = `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}`;
  const client = new Client(DATABASE_URL);
  client.connect();// подключаемся к БД
  // client.query('UPDATE article SET last_update = ($1), image = ($2), theme = ($3), category = ($4), text_art = ($5) WHERE id= ($6) and user_id = ($7)',
  client.query('UPDATE article SET image = ($1), theme = ($2), category = ($3), text_art = ($4) WHERE id= ($5) and user_id = ($6)',
    [article.image, article.theme, article.category, article.text_art, articleId, userId])
    .then(() => {
      client.query('SELECT * FROM article  WHERE id= ($1) and user_id = ($2)', [articleId, userId])
        .then((result) => {
          res.send({ message: 'Статья обновлена', data: result.rows });
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

const postArticle = (req, res, next) => {
  const userId = req.user._id;
  const { articleId } = req.params;
  const { posted } = req.query;
  const client = new Client(DATABASE_URL);
  client.connect();// подключаемся к БД
  client.query('UPDATE article SET posted = ($1) WHERE id= ($2) and user_id = ($3)',
    [posted, articleId, userId])
    .then(() => {
      client.query('SELECT posted FROM article  WHERE id= ($1) and user_id = ($2)', [articleId, userId])
        .then((result) => {
          res.send({ message: 'Признак публикации изменен', data: result.rows[0].posted });
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

const deleteArticle = (req, res, next) => {
  const userId = req.user._id;
  const { articleId } = req.params;
  const client = new Client(DATABASE_URL);
  client.connect();// подключаемся к БД
  client
    .query(
      `SELECT posted from article WHERE user_id = ($1) and id = ($2)
    `, [userId, articleId],
    )
    .then((result) => {
      if (result.rows[0].posted) {
        next({ message: 'С начала снимите с публикации' });
        return client.end();
      }
      client
        .query(
          'DELETE from article WHERE user_id = ($1) and id = ($2)',
          [userId, articleId],
        )
        .then(() => {
          res.send({ message: 'Статья удалена' });
          client.end();
        });
    })
    .catch((err) => {
      client.end();
      next(err);
    });
};

// Блок статьей в ленте
const getArticlesAll = (req, res, next) => {
  const client = new Client(DATABASE_URL);
  client.connect();// подключаемся к БД

  client
    .query(
      `SELECT id, date_create, image, theme, category, text_art
        FROM article
        WHERE posted = 'true'
        ORDER BY date_create`,
    )
    .then((result) => {
      res.send({ data: result.rows, status: 200 });
      client.end();
    })
    .catch((err) => {
      client.end();
      next(err);
    });
};

module.exports = {
  createArticle,
  getArticlesAuthor,
  getArticleAuthor,
  patchArticle,
  deleteArticle,
  postArticle,
  getArticlesAll,
};

const { Client } = require('pg');
const sanitizeHtml = require('sanitize-html');
const { DATABASE_URL } = require('../config');
const { badWord, replacements } = require('../const');

const createArticle = (req, res, next) => {
  const { theme, category, textArt } = req.body;

  const userId = req.user._id;
  const client = new Client(DATABASE_URL);
  client.connect();// подключаемся к БД

  client
    .query(
      'INSERT INTO article (user_id, theme, category, text_art) VALUES ($1, $2, $3, $4)',
      [userId, sanitizeHtml(theme), sanitizeHtml(category), sanitizeHtml(textArt)],
    )
    .then(() => {
      res.send({ message: 'Статья создана. Можете ее опубликовать', status: 200 });
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
    [article.image, article.theme, article.category, article.textArt, articleId, userId])
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
  const anyArticles = `SELECT article.id, article.date_create, article.image, article.theme, article.category, article.text_art, user_article_feed.liked, user_article_feed.watched
        FROM article
        LEFT JOIN user_article_feed ON user_article_feed.article_id = article.id
        WHERE article.posted = 'true'
        ORDER BY article.date_create desc, article.id desc
        LIMIT 10 OFFSET ($1)`;

  const likedArticles = `SELECT article.id, article.date_create, article.image, article.theme, article.category, article.text_art, user_article_feed.liked, user_article_feed.watched
        FROM article
        LEFT JOIN user_article_feed ON user_article_feed.article_id = article.id
        WHERE article.posted = 'true' and user_article_feed.liked = true
        ORDER BY article.date_create desc, article.id desc
        LIMIT 10 OFFSET ($1)`;

  const { filter, offset } = req.query;

  const client = new Client(DATABASE_URL);
  client.connect();// подключаемся к БД

  client
    .query(
      filter === 'liked' ? likedArticles : anyArticles, [offset]
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

const likeArticle = (req, res, next) => {
  const userId = req.user._id;
  const { articleId } = req.params;

  const client = new Client(DATABASE_URL);
  client.connect();// подключаемся к БД

  client
    .query(
      'select * from user_article_feed WHERE article_id = ($1) and user_id = ($2)', [articleId, userId],
    )
    .then((result) => {
      // если пустое, значит пользователь ничего со статьей еще не делал
      if (!result.rows.length) {
        client.query('INSERT INTO user_article_feed (user_id, article_id, liked) VALUES ($1, $2, $3)', [userId, articleId, true])
          .then((resIns) => {
            res.send({ message: 'Добавлена запись', data: resIns.rows });
            return client.end();
          })
          .catch((err) => {
            client.end();
            next(err);
          });
      } else {
        // если что-то возвращается, значит пользователь что-то уже делал со статьей
        client.query('UPDATE user_article_feed SET liked = (CASE WHEN liked = true THEN false ELSE true END) WHERE article_id = ($1) and user_id = ($2)', [articleId, userId])
          .then((resUpd) => {
            res.send({ message: 'Обновлена запись', data: resUpd.rows });
            return client.end();
          })
          .catch((err) => {
            client.end();
            next(err);
          });
      }

      // res.send({ message: 'Не добавлена запись, надо апдейтить', data: result.rows });
    })
    .catch((err) => {
      client.end();
      next(err);
    });
};

const watchArticle = (req, res, next) => {
  const userId = req.user._id;
  const { articleId } = req.params;

  const client = new Client(DATABASE_URL);
  client.connect();// подключаемся к БД

  client
    .query(
      'select * from user_article_feed WHERE article_id = ($1) and user_id = ($2)', [articleId, userId],
    )
    .then((result) => {
      // если пустое, значит пользователь ничего со статьей еще не делал
      if (!result.rows.length) {
        client.query('INSERT INTO user_article_feed (user_id, article_id, watched) VALUES ($1, $2, $3)', [userId, articleId, true])
          .then((resIns) => {
            res.send({ message: 'Добавлена запись', data: resIns.rows });
            return client.end();
          })
          .catch((err) => {
            client.end();
            next(err);
          });
      } else {
        // если что-то возвращается, значит пользователь что-то уже делал со статьей
        client.query('UPDATE user_article_feed SET liked = true WHERE article_id = ($1) and user_id = ($2)', [articleId, userId])
          .then((resUpd) => {
            res.send({ message: 'Обновлена запись', data: resUpd.rows });
            return client.end();
          })
          .catch((err) => {
            client.end();
            next(err);
          });
      }

      // res.send({ message: 'Не добавлена запись, надо апдейтить', data: result.rows });
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
  likeArticle,
};

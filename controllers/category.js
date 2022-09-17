const { Client } = require('pg');
const { DATABASE_URL } = require('../config');
const { notWords } = require('../const');
// const { PermissionError, ArticleNotExist } = require('../errors/errors');
// const { dataNotFound, permissionText } = require('../const');

const getCategories = (req, res, next) => {
  const userId = req.user._id;
  const client = new Client(DATABASE_URL);
  client.connect();
  client.query('SELECT id, category FROM category_word WHERE user_id = ($1)', [userId])
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

const addCategory = (req, res, next) => {
  const category = req.body;
  const userId = req.user._id;
  const client = new Client(DATABASE_URL);
  client.connect();// подключаемся к БД
  client
    .query('INSERT INTO category_word (category, user_id) VALUES ($1, $2)', [category.categoryWord, userId])
    .then(() => {
      res.send({ message: 'Категория добавлена' });
      client.end();
    })
    .catch((err) => {
      client.end();
      next(err);
    });
};

const deleteCategory = (req, res, next) => {
  const client = new Client(DATABASE_URL);
  client.connect();
  client
    .query('DELETE FROM category_word WHERE id = ($1)', [req.params.id])
    .then(() => {
      res.send({ message: 'Категория удалена' });
      client.end();
    })
    .catch((err) => {
      client.end();
      next(err);
    });
};

module.exports = {
  addCategory, getCategories, deleteCategory,
};

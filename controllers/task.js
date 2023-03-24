const { Client } = require('pg');
const { DATABASE_URL } = require('../config');

const createTask = (req, res, next) => {
  const task = req.body;
  const userId = req.user._id;
  const client = new Client(DATABASE_URL);
  client.connect();// подключаемся к БД

  client
    .query(
      'INSERT INTO task (words, rules, translate, read, other, user_id) VALUES ($1, $2, $3, $4, $5, $6)',
      [task.words, task.rules, task.translate, task.read, task.otherm, userId],
    )
    .then(() => {
      res.send({ message: 'Задание создано' });
      client.end();
    })
    .catch((err) => {
      client.end();
      next(err);
    });
};

module.exports = { createTask };

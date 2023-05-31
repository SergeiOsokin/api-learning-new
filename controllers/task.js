const { Client } = require('pg');
const { DATABASE_URL } = require('../config');

const createTask = (req, res, next) => {
  const task = req.body;
  const userId = req.user._id;
  const client = new Client(DATABASE_URL);
  client.connect();// подключаемся к БД

  client
    .query(
      'INSERT INTO task (theme, words, rules, translate, read, other, user_id) VALUES ($1, $2, $3, $4, $5, $6, $7)',
      [task.theme, task.words, task.rules, task.translate, task.read, task.other, userId],
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

const getTaskThemesTeacher = (req, res, next) => {
  const userId = req.user._id;
  const client = new Client(DATABASE_URL);
  client.connect();// подключаемся к БД

  client
    .query(
      'SELECT id, theme FROM task WHERE user_id = ($1)', [userId],
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

const getTaskTeacher = (req, res, next) => {
  const userId = req.user._id;
  const { taskId } = req.params;
  const client = new Client(DATABASE_URL);
  client.connect();// подключаемся к БД

  client
    .query(
      'SELECT id, theme, words, rules, translate, read, other FROM task WHERE user_id = ($1) and id = ($2)', [userId, taskId],
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

const patchTask = (req, res, next) => {
  const userId = req.user._id;
  const {
    theme, words, rules, translate, read, other,
  } = req.body;
  const { taskId } = req.params;
  const client = new Client(DATABASE_URL);
  client.connect();// подключаемся к БД
  client.query('UPDATE task SET theme = ($1), words = ($2), rules = ($3), translate = ($4), read = ($5), other = ($6) WHERE id=($7)',
    [theme, words, rules, translate, read, other, taskId])
    .then(() => {
      client.query('SELECT id, theme, words, rules, translate, read, other FROM task WHERE user_id = ($1) and id = ($2)', [userId, taskId])
        .then((result) => {
          res.send({ message: 'Задание изменено', data: result.rows });
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

const deleteNote = (req, res, next) => {
  const client = new Client(DATABASE_URL);
  client.connect();// подключаемся к БД
  client
    .query('DELETE FROM task WHERE id = ($1)', [req.params.taskId])
    .then(() => {
      res.send({ message: 'Задание удалено' });
      client.end();
    })
    .catch((err) => {
      client.end();
      next(err);
    });
};

module.exports = {
  createTask, getTaskThemesTeacher, getTaskTeacher, patchTask, deleteNote,
};

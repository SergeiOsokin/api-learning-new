const { Client } = require('pg');
const { DATABASE_URL } = require('../config');

// Студент
const getHomeworkThemes = (req, res, next) => {
  const userId = req.user._id;
  const client = new Client(DATABASE_URL);
  client.connect();// подключаемся к БД

  client
    .query(
      `SELECT *
      FROM task_student
      JOIN task ON task.id = task_student.task_id
      WHERE task_student.user_id = ($1)`,
      [userId],
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

const getHomework = (req, res, next) => {
  const userId = req.user._id;
  const { taskId } = req.params;
  const client = new Client(DATABASE_URL);
  client.connect();// подключаемся к БД

  client
    .query(
      `SELECT task.id, task.theme, task.words, task.rules, task.translate, task.read, task.other
        FROM task
        LEFT join task_student ON task_student.task_id = task.id
        WHERE task.id = ($1) and task_student.user_id = ($2)`, [taskId, userId],
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
  getHomeworkThemes,
  getHomework,
};

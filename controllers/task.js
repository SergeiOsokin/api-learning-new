const { Client } = require('pg');
const { DATABASE_URL } = require('../config');

// Учитель
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
      'SELECT * FROM task WHERE user_id = ($1)', [userId],
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
  const { taskId } = req.params;
  const client = new Client(DATABASE_URL);
  client.connect();// подключаемся к БД

  client
    .query(
      `SELECT task.id, task.theme, task.words, task.rules, task.translate, task.read, task.other, array_agg(users.email) as users
        FROM task
        LEFT join task_student ON task_student.task_id = task.id
        LEFT join users ON users.id = task_student.user_id
        WHERE task.id = ($1)
        GROUP BY task.id
        `, [taskId],
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

const appointTask = (req, res, next) => {
  console.log(req);
  const { taskId } = req.params;
  const userEmail = req.body.users.split(';');
  const userEmail1 = userEmail[0];
  const userEmail2 = userEmail[1] === undefined ? 'null' : userEmail[1];
  const userEmail3 = userEmail[2] === undefined ? 'null' : userEmail[2];
  const userEmail4 = userEmail[3] === undefined ? 'null' : userEmail[3];
  const userEmail5 = userEmail[4] === undefined ? 'null' : userEmail[4];
  const client = new Client(DATABASE_URL);
  client.connect();// подключаемся к БД
  // нет проверки на уникальность, можно добавлять одно и тоже задание на того же ученика
  client
    .query(
      `INSERT INTO task_student (task_id, user_id)
      SELECT task.id, users.id
      FROM task, users
      WHERE task.id = $1 and users.email in ($2,$3,$4,$5,$6)`,
      [taskId, userEmail1, userEmail2, userEmail3, userEmail4, userEmail5],
    )
    .then(() => {
      res.send({ message: 'Задание назначено' });
      client.end();
    })
    .catch((err) => {
      client.end();
      next(err);
    });
};

const unappointTask = (req, res, next) => {
  console.log(req.body);
  // const { taskId } = req.params;
  // const userId = req.body;
  // const client = new Client(DATABASE_URL);
  // client.connect();// подключаемся к БД
  // client
  //   .query(
  //     'SELECT from task_student WHERE task_student.task_id = ($1) and task_student.user_id = (select id from user where email = ($2))',
  //     [taskId, userId],
  //   )
  //   .then(() => {
  //     res.send({ message: 'Задание с ученика снято' });
  //     client.end();
  //   })
  //   .catch((err) => {
  //     client.end();
  //     next(err);
  //   });
};


// client.query('SELECT email from users where email=$1', [userEmail])
//   .then((select) => {
//     if (select.rows.length === 0) {
//       res.send({ message: 'Логин пользователя не найден' });
//       return client.end();
//     }
//     client
//       .query(
//         `INSERT INTO task_student (task_id, user_id)
//         SELECT task.id, users.id
//         FROM task, users
//         WHERE task.id = $1 and users.email in ($2)`,
//         [taskId, userEmail],
//       )
//       .then(() => {
//         res.send({ message: 'Задание назначено' });
//         client.end();
//       })
//       .catch((err) => {
//         client.end();
//         next(err);
//       });
//   })
//   .catch((err) => {
//     client.end();
//     next(err);
//   });
// };

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

const deleteTask = (req, res, next) => {
  const client = new Client(DATABASE_URL);
  client.connect();// подключаемся к БД
  client
    .query(
      `DELETE from task_student WHERE task_student.task_id = ($1)
    `, [req.params.taskId],
    );
  client
    .query(
      `DELETE from task WHERE task.id = ($1)
    `, [req.params.taskId],
    )
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
  createTask,
  getTaskThemesTeacher,
  getTaskTeacher,
  patchTask,
  deleteTask,
  appointTask,
  unappointTask,
};

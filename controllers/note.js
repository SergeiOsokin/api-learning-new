const { Client } = require('pg');
const { DATABASE_URL } = require('../config');
// const { PermissionError, ArticleNotExist } = require('../errors/errors');
// const { dataNotFound, permissionText } = require('../const');

// Добавить поле дата создания
const addNote = (req, res, next) => {
  const note = req.body;
  const userId = req.user._id;
  const client = new Client(DATABASE_URL);
  client.connect();// подключаемся к БД
  client
    .query('INSERT INTO notes (theme, text, example, user_id) VALUES ($1, $2, $3, $4)', [note.theme, note.text, note.example, userId])
    .then(() => {
      res.send({ message: 'Заметка добавлена' });
      client.end();
    })
    .catch((err) => {
      client.end();
      next(err);
    });
};

const getNoteThemes = (req, res, next) => {
  const userId = req.user._id;
  const client = new Client(DATABASE_URL);
  client.connect();// подключаемся к БД
  client.query('SELECT id, theme FROM notes WHERE user_id = ($1)', [userId])
    .then((result) => {
      res.send(result.rows);
      client.end();
    })
    .catch((err) => {
      client.end();
      next(err);
    });
};

// Получить одну заметку
const getNote = (req, res, next) => {
  // console.log('тут');
  const userId = req.user._id;
  const { noteId } = req.params;
  const client = new Client(DATABASE_URL);
  client.connect();// подключаемся к БД
  client.query('SELECT id, theme, text, example FROM notes WHERE id = ($1) and user_id = ($2)', [noteId, userId])
    .then((result) => {
      res.send(result.rows);
      client.end();
    })
    .catch((err) => {
      client.end();
      next(err);
    });
};

// Переделать на нормальное полуение всех заметок: заголовок, текст
const getNotes = (req, res, next) => {
  const userId = req.user._id;
  // const { noteId } = req.params;
  const client = new Client(DATABASE_URL);
  client.connect();// подключаемся к БД
  client.query('SELECT id, theme, text, example, date_create FROM notes WHERE user_id = ($1)', [userId])
    .then((result) => {
      res.send({ data: result.rows, status: 200 });
      client.end();
    })
    .catch((err) => {
      client.end();
      next(err);
    });
};

const patchNote = (req, res, next) => {
  const userId = req.user._id;
  const { noteId } = req.params;
  const {
    theme, text, example,
  } = req.body;
  const client = new Client(DATABASE_URL);
  client.connect();// подключаемся к БД
  client.query('UPDATE notes SET theme = ($1), text = ($2), example = ($3) WHERE id=($4)', [theme, text, example, noteId])
    .then(() => {
      client.query('SELECT id, theme, text, example FROM notes WHERE id = ($1) and user_id = ($2)', [noteId, userId])
        .then((result) => {
          res.send({ message: 'Заметка изменена', data: result.rows });
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
    .query('DELETE FROM notes WHERE id = ($1)', [req.params.noteId])
    .then(() => {
      res.send({ message: 'Заметка удалена' });
      client.end();
    })
    .catch((err) => {
      client.end();
      next(err);
    });
};

module.exports = {
  getNote, getNotes, patchNote, addNote, deleteNote, getNoteThemes,
};

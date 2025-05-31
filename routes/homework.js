const routerHomework = require('express').Router();
const {
  getHomeworkThemes,
  getHomework,
  postFinished,
} = require('../controllers/homework');

const {
  validationGetHomeworkThemes,
  validationGetHomework,
} = require('../middlewares/validationHomework');

routerHomework.get('/themes/all', validationGetHomeworkThemes, getHomeworkThemes);
routerHomework.get('/theme/:taskId', validationGetHomework, getHomework);
routerHomework.post('/finised/:taskId', postFinished);

module.exports = routerHomework;

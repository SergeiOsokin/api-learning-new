const routerHomework = require('express').Router();
const {
  getHomeworkThemes,
  getHomework,
} = require('../controllers/homework');

const {
  validationGetHomeworkThemes,
  validationGetHomework,
} = require('../middlewares/validationHomework');

routerHomework.get('/themes/all', validationGetHomeworkThemes, getHomeworkThemes);
routerHomework.get('/theme/:taskId', validationGetHomework, getHomework);

module.exports = routerHomework;

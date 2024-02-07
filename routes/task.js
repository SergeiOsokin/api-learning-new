const routerTaks = require('express').Router();
const {
  createTask, getTaskThemesTeacher, getTaskTeacher, patchTask, deleteTask, appointTask,
  getTaskThemesStudent,
} = require('../controllers/task');

const {
  validationCreateTask, validationGetTaskThemesTeacher,
  validationGetTaskTeacher, validationPatchTask, validationDeleteTask,
} = require('../middlewares/validationTask');

routerTaks.post('/create', validationCreateTask, createTask);

routerTaks.get('/themesStudent', getTaskThemesStudent);

routerTaks.get('/themes', validationGetTaskThemesTeacher, getTaskThemesTeacher);
routerTaks.get('/theme/:taskId', validationGetTaskTeacher, getTaskTeacher);

routerTaks.post('/appoint/:taskId', appointTask);

routerTaks.patch('/patch/:taskId', validationPatchTask, patchTask);
routerTaks.delete('/delete/:taskId', validationDeleteTask, deleteTask);

module.exports = routerTaks;

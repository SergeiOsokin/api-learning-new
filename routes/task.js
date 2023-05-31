const routerTaks = require('express').Router();
const {
  createTask, getTaskThemesTeacher, getTaskTeacher, patchTask, deleteNote,
} = require('../controllers/task');
const {
  validationCreateTask, validationGetTaskThemesTeacher,
  validationGetTaskTeacher, validationPatchTask, validationDeleteTask,
} = require('../middlewares/validationTask');

routerTaks.post('/create', validationCreateTask, createTask);
routerTaks.get('/themes', validationGetTaskThemesTeacher, getTaskThemesTeacher);
routerTaks.get('/theme/:taskId', validationGetTaskTeacher, getTaskTeacher);
routerTaks.patch('/patch/:taskId', validationPatchTask, patchTask);
routerTaks.delete('/delete/:taskId', validationDeleteTask, deleteNote);

module.exports = routerTaks;

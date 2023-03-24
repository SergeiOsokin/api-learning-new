const routerTaks = require('express').Router();
const { createTask } = require('../controllers/task');
const { validationCreateTask } = require('../middlewares/validationTask');

routerTaks.post('/create', validationCreateTask, createTask);

module.exports = routerTaks;

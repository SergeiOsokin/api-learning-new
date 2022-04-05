const routerUsers = require('express').Router();
const { getUser } = require('../controllers/user');
const { validationGetUser } = require('../middlewares/validationUser');

// routerUsers.get('/me', validationGetUser, getUser);

// module.exports = routerUsers;

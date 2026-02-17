const routerLk = require('express').Router();
const { genToken, getToken } = require('../controllers/lk');
const { validationGetUser } = require('../middlewares/validationUser');

routerLk.post('/gen/token', genToken);
routerLk.get('/token', getToken);

module.exports = routerLk;

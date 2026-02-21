const routerLk = require('express').Router();
const { genToken, getToken, newPassword } = require('../controllers/lk');
const { validationGetUser } = require('../middlewares/validationUser');

routerLk.post('/gen/token', genToken);
routerLk.get('/token', getToken);
routerLk.post('/password', newPassword);

module.exports = routerLk;

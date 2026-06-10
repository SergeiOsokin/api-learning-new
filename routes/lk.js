const routerLk = require('express').Router();
const { genToken, getToken, newPassword, editUserType } = require('../controllers/lk');
const { validationGetUser } = require('../middlewares/validationUser');

routerLk.post('/gen/token', genToken);
routerLk.get('/token', getToken);
routerLk.post('/password', newPassword);
routerLk.patch('/user/type', editUserType);

module.exports = routerLk;

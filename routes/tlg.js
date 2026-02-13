const routerTlg = require('express').Router();

const {
  loginTlg, getWords,
} = require('../controllers/tlg');
const { validationLogin, validationGetSmth } = require('../middlewares/validationTlg');

routerTlg.post('/login', validationLogin, loginTlg);
routerTlg.post('/words', validationGetSmth, getWords);

module.exports = routerTlg;

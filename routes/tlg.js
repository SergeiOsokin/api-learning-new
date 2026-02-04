const routerTlg = require('express').Router();

const {
  loginTlg, getWords,
} = require('../controllers/tlg');

// const {
//   validationGetNotes, validationAddNote, validationPatchNotes, validationDeleteNotes,
// } = require('../middlewares/validationNote');

routerTlg.post('/login', loginTlg);
routerTlg.post('/words', getWords);

module.exports = routerTlg;

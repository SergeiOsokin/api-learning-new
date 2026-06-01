const routerAi = require('express').Router();
const { genSentence } = require('../controllers/ai');
const { validationGetUser } = require('../middlewares/validationAi');

// routerLk.post('/gen/token', genToken);
// routerLk.get('/token', getToken);
routerAi.post('/sentence', genSentence);

module.exports = routerAi;

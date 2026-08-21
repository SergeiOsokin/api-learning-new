const routerBaseTest = require('express').Router();
const {
  getTest,
} = require('../controllers/baseTest');
const {
  validationGetTest,
} = require('../middlewares/validationBaseTest');

routerBaseTest.get('/:theme', getTest);

module.exports = routerBaseTest;

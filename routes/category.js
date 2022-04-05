const routerWords = require('express').Router();
const {
  addCategory, getCategories
} = require('../controllers/category');
const {
  validationAddCategory,
  validationGetCategories,
} = require('../middlewares/validationCategory');

routerWords.post('/add', validationAddCategory, addCategory);

routerWords.get('/get', validationGetCategories, getCategories);

module.exports = routerWords;

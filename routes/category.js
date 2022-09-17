const routerWords = require('express').Router();
const {
  addCategory, getCategories, deleteCategory,
} = require('../controllers/category');
const {
  validationAddCategory,
  validationGetCategories,
  validationDeleteCategory,
} = require('../middlewares/validationCategory');

routerWords.post('/add', validationAddCategory, addCategory);

routerWords.get('/get', validationGetCategories, getCategories);

routerWords.delete('/delete/:id', validationDeleteCategory, deleteCategory);

module.exports = routerWords;

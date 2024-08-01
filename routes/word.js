const routerWords = require('express').Router();
const {
  getWords, patchWord, addWord, deleteWord, getWordsByCategory,
} = require('../controllers/word');
const {
  validationAddWord,
  validationDeleteWord,
  validationPatchWord,
} = require('../middlewares/validationWords');

// routerWords.get('/wordslist', validationGetWords, getWords);
routerWords.get('/list', getWords);
routerWords.get('/lists', getWordsByCategory);

routerWords.post('/add', validationAddWord, addWord);

routerWords.patch('/patch/:id', validationPatchWord, patchWord);

routerWords.delete('/delete/:wordId', validationDeleteWord, deleteWord);

module.exports = routerWords;

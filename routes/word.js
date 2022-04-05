const routerWords = require('express').Router();
const {
  getWords, patchWord, addWord, deleteWord, addCategory, getCategories
} = require('../controllers/word');
const {
  validationGetWords,
  validationAddWord,
  validationDeleteWord,
  validationPatchWord
} = require('../middlewares/validationWords');

// routerWords.get('/wordslist', validationGetWords, getWords);
routerWords.get('/wordslist', getWords);

routerWords.post('/addword', validationAddWord, addWord);

routerWords.patch('/patchword/:id', validationPatchWord, patchWord);

routerWords.delete('/deleteword/:wordId', validationDeleteWord, deleteWord);

module.exports = routerWords;

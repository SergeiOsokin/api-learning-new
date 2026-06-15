const routerArticle = require('express').Router();
const {
  createArticle, getArticlesAuthor, getArticle, patchArticle, deleteArticle,
  postArticle,
} = require('../controllers/article');

const {
  validationCreateArticle, validationGetArticles,
  validationGetArticle, validationPatchArticle, validationDeleteArticle, validationPostArticle,
} = require('../middlewares/validationArticle');

routerArticle.post('/create', validationCreateArticle, createArticle);

routerArticle.get('/all', validationGetArticles, getArticlesAuthor);
routerArticle.get('/:articleId', validationGetArticle, getArticle);

routerArticle.patch('/patch/:articleId', validationPatchArticle, patchArticle);
routerArticle.patch('/post/:articleId', validationPostArticle, postArticle);
routerArticle.delete('/delete/:articleId', validationDeleteArticle, deleteArticle);

module.exports = routerArticle;

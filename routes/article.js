const routerArticle = require('express').Router();
const {
  createArticle, getArticlesAuthor, getArticleAuthor, patchArticle, deleteArticle,
  postArticle, getArticlesAll,
} = require('../controllers/article');

const {
  validationCreateArticle, validationGetArticles,
  validationGetArticle, validationPatchArticle, validationDeleteArticle, validationPostArticle,
} = require('../middlewares/validationArticle');

routerArticle.post('/create', validationCreateArticle, createArticle);

routerArticle.get('/feed', validationGetArticles, getArticlesAll);
routerArticle.get('/all', validationGetArticles, getArticlesAuthor);
routerArticle.get('/:articleId', validationGetArticle, getArticleAuthor);

routerArticle.patch('/patch/:articleId', validationPatchArticle, patchArticle);
routerArticle.patch('/post/:articleId', validationPostArticle, postArticle);

routerArticle.delete('/delete/:articleId', validationDeleteArticle, deleteArticle);

module.exports = routerArticle;

const routerArticle = require('express').Router();
const {
  createArticle, getArticlesAuthor, getArticleAuthor, patchArticle, deleteArticle,
  postArticle, getArticlesAll,
  likeArticle,
} = require('../controllers/article');

const {
  validationCreateArticle, validationGetArticles,
  validationGetArticle, validationPatchArticle, validationDeleteArticle, validationPostArticle,
  validationLikeArticle,
} = require('../middlewares/validationArticle');

routerArticle.post('/create', validationCreateArticle, createArticle);
routerArticle.post('/like/:articleId', validationLikeArticle, likeArticle);

routerArticle.get('/feed', validationGetArticles, getArticlesAll);
routerArticle.get('/all', validationGetArticles, getArticlesAuthor);
routerArticle.get('/:articleId', validationGetArticle, getArticleAuthor);

routerArticle.patch('/patch/:articleId', validationPatchArticle, patchArticle);
routerArticle.patch('/post/:articleId', validationPostArticle, postArticle);

routerArticle.delete('/delete/:articleId', validationDeleteArticle, deleteArticle);

module.exports = routerArticle;

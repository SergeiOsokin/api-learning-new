const routerArticle = require('express').Router();
const {
  createArticle, getArticlesAuthor, getArticle, patchArticle, deleteArticle,
} = require('../controllers/article');

const {
  validationCreateArticle, validationGetArticles,
  validationGetArticle, validationPatchArticle, validationDeleteArticle,
} = require('../middlewares/validationArticle');

routerArticle.post('/create', validationCreateArticle, createArticle);

routerArticle.get('/all', validationGetArticles, getArticlesAuthor);
routerArticle.get('/:articleId', validationGetArticle, getArticle);

routerArticle.patch('/patch/:articleId', validationPatchArticle, patchArticle);
// routerArticle.delete('/delete/:taskId', validationDeleteArticle, deleteArticle);

module.exports = routerArticle;

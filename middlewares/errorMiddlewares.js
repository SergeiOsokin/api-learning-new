const { NotUniqueUser } = require('../errors/errors');

const { alreadyExist, errorInArticleId } = require('../const');

const errorMiddleware = (err, req, res, next) => {
  const notUnique = new NotUniqueUser(alreadyExist);
  const errObjectId = err.message
    .startsWith('Cast to ObjectId failed') ? errorInArticleId : null;
  if (err.statusCode || err.name === 'ValidationError') {
    return res.status(err.statusCode || 400).send({ error: `${err.message}` });
  }
  if (err.message.startsWith('E11000 duplicate key error')) {
    return res.status(notUnique.statusCode).send({ error: `${notUnique.message}` });
  }
  res.status(500).send({ error: `${errObjectId || err.message}` });
  return next();
};
module.exports = { errorMiddleware };

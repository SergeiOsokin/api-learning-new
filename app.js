const express = require('express');
require('dotenv').config();
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { limiter } = require('./rateLimit-config');

const { routerWords, routerNotes, routerCategory } = require('./routes/index');
const { createUser, login, getUser } = require('./controllers/user');
const { auth } = require('./middlewares/auth');
const { deleteCookie } = require('./middlewares/deleteCookie');
const { requestLogger, errorLogger } = require('./middlewares/loggers');
const { validationCreateUser, validationLogin } = require('./middlewares/validationUser');
const { errorMiddleware } = require('./middlewares/errorMiddlewares');
const { NotFound } = require('./errors/errors');
const { resourceNotFound } = require('./const');
const { PORT, NODE_ENV } = require('./config');
const routerTaks = require('./routes/task');
const routerHomework = require('./routes/homework');

const whitelist = [
  'http://localhost:8080',
  'http://127.0.0.1:5500',
  'http://localhost:3000',
  'http://learnew.online',
  'https://learnew.online',
  'http://www.learnew.ru',
  'https://wwww.learnew.ru',
  'http://learnew.ru',
  'https://learnew.ru',
  'https://learnew.ru/',
  'https://learnew.ru/api',
];

const corsOptions = {
  origin: (origin, callback) => {
    // if (whitelist.indexOf(origin) !== -1) {
    callback(null, true);
    //   } else {
    //     callback(new Error('Not allowed by CORS'));
    //   }
  },
  credentials: true,
  // exposedHeaders: ['set-cookie'],
};

const app = express();
app.use(cookieParser());
app.use(cors(corsOptions));

app.use(limiter);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(helmet());
app.use(requestLogger);

app.post('/api/signup', validationCreateUser, createUser);
app.post('/api/signin', validationLogin, login);
app.get('/api/users', getUser);

app.use('/api/words', auth, routerWords);

app.use('/api/notes', auth, routerNotes);

app.use('/api/category', auth, routerCategory);

app.use('/api/task', auth, routerTaks);
app.use('/api/homework', auth, routerHomework);

app.delete('/api/deletecookie', auth, deleteCookie);


app.use(errorLogger);
app.use('*', (req, res, next) => next(new NotFound(resourceNotFound)));
app.use(errors());
app.use(errorMiddleware);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Begin listening ${PORT} ${NODE_ENV}`);
});

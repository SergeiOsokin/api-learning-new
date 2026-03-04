const express = require('express');

const app = express();
const path = require('path');
require('dotenv').config();
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const serverWS = require('http').createServer(app);
const io = require('socket.io')(serverWS);
const { validate, version } = require('uuid');

const { limiter } = require('./rateLimit-config');
const { routerWords, routerNotes, routerCategory } = require('./routes/index');
const { createUser, login, resetPassword } = require('./controllers/user');
const { auth } = require('./middlewares/auth');
const { deleteCookie } = require('./middlewares/deleteCookie');
const { requestLogger, errorLogger } = require('./middlewares/loggers');
const { validationCreateUser, validationLogin } = require('./middlewares/validationUser');
const { errorMiddleware } = require('./middlewares/errorMiddlewares');
const { NotFound } = require('./errors/errors');
const { resourceNotFound } = require('./const');
const { PORT, NODE_ENV, PORT_WS } = require('./config');
const routerTaks = require('./routes/task');
const routerHomework = require('./routes/homework');
const routerTlg = require('./routes/tlg');
const routerLk = require('./routes/lk');
const ACTIONS = require('./middlewares/actions');

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

app.use(cookieParser());
app.use(cors(corsOptions));

app.use(limiter);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(helmet());
app.use(requestLogger);

app.post('/api/signup', validationCreateUser, createUser);
app.post('/api/signin', validationLogin, login);
app.post('/api/reset', resetPassword);
// app.get('/api/users', getUser);
app.use('/api/tlg', routerTlg);
app.use('/api/lk', auth, routerLk);
app.use('/api/words', auth, routerWords);
app.use('/api/notes', auth, routerNotes);
app.use('/api/category', auth, routerCategory);
app.use('/api/task', auth, routerTaks);
app.use('/api/homework', auth, routerHomework);

app.delete('/api/deletecookie', auth, deleteCookie);
// видеозвонки
// io.on('connection', (socket) => {
//   console.log('Socket connection');
// });

const getClientsRooms = () => {
  const { rooms } = io.sockets.adapter;

  return Array.from(rooms.keys()).filter((roomID) => validate(roomID) && version(roomID) === 4);
};

const shareRoomsInfo = () => {
  io.emit(ACTIONS.SHARE_ROOMS, {
    rooms: getClientsRooms(),
  });
};

// логика подключения к комнатам
io.on('connection', (socket) => {
  console.log('Socket connection');
  shareRoomsInfo();

  socket.on(ACTIONS.JOIN, (config) => {
    const { room: roomID } = config;
    const { rooms: joinedRooms } = socket;

    if (Array.from(joinedRooms).includes(roomID)) {
      return console.warn(`Уже подключены ${roomID}`);
    }

    const clients = Array.from(io.sockets.adapter.rooms.get(roomID) || []);

    clients.forEach((clientID) => {
      io.to(clientID).emit(ACTIONS.ADD_PEER, {
        peerID: socket.id,
        createOffer: false,
      });

      socket.emit(ACTIONS.ADD_PEER, {
        peerID: clientID,
        createOffer: true,
      });
    });

    socket.join(roomID);
    shareRoomsInfo();
  });

  const leaveRoom = () => {
    const { rooms } = socket;

    Array.from(rooms).forEach((roomID) => {
      const clients = Array.from(io.sockets.adapter.rooms.get(roomID) || []);

      clients.forEach((clientID) => {
        io.to(clientID).emit(ACTIONS.REMOVE_PEER, {
          peerID: socket.id,
        });

        socket.emit(ACTIONS.REMOVE_PEER, {
          peerID: clientID,
        });
      });

      socket.leave(roomID);

      shareRoomsInfo();
    });

    shareRoomsInfo();
  };

  socket.on(ACTIONS.LEAVE, leaveRoom);
  socket.on('disconnecting', leaveRoom);
});


app.use(errorLogger);
app.use('*', (req, res, next) => next(new NotFound(resourceNotFound)));
app.use(errors());
app.use(errorMiddleware);

serverWS.listen(PORT_WS, () => {
  // eslint-disable-next-line no-console
  console.log(`Begin ws listening ${PORT_WS} ${NODE_ENV}`);
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Begin app listening ${PORT} ${NODE_ENV}`);
});

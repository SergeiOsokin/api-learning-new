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
const STEP = require('./middlewares/actions');

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

function getClientRooms() {
  const { rooms } = io.sockets.adapter;

  return Array.from(rooms.keys()).filter((roomID) => validate(roomID) && version(roomID) === 4);
}

function shareRoomsInfo() {
  io.emit(STEP.SHARE_ROOMS, {
    rooms: getClientRooms(),
  });
}

// io.on('connection', (socket) => {
//   shareRoomsInfo();

//   function leaveRoom() {
//     const { rooms } = socket;

//     Array.from(rooms)
//       .filter((roomID) => validate(roomID) && version(roomID) === 4)
//       .forEach((roomID) => {
//         const clients = Array.from(io.sockets.adapter.rooms.get(roomID) || []);

//         clients
//           .forEach((clientID) => {
//             io.to(clientID).emit(STEP.REMOVE_PEER, {
//               peerID: socket.id,
//             });

//             socket.emit(STEP.REMOVE_PEER, {
//               peerID: clientID,
//             });
//           });

//         socket.leave(roomID);
//       });

//     shareRoomsInfo();
//   }

//   socket.on(STEP.JOIN, (config) => {
//     const { room: roomID } = config;
//     const { rooms: joinedRooms } = socket;

//     if (Array.from(joinedRooms).includes(roomID)) {
//       return console.warn(`Already joined to ${roomID}`);
//     }

//     if (io.engine.clientsCount === 2) {
//       socket.on(STEP.LEAVE, leaveRoom);
//       socket.on('disconnecting', leaveRoom);
//       return console.warn(`Max members in room: ${roomID}`);
//     }

//     const clients = Array.from(io.sockets.adapter.rooms.get(roomID) || []);

//     clients.forEach((clientID) => {
//       io.to(clientID).emit(STEP.ADD_PEER, {
//         peerID: socket.id,
//         createOffer: false,
//       });

//       socket.emit(STEP.ADD_PEER, {
//         peerID: clientID,
//         createOffer: true,
//       });
//     });

//     socket.join(roomID);
//     shareRoomsInfo();
//   });

//   socket.on(STEP.LEAVE, leaveRoom);
//   socket.on('disconnecting', leaveRoom);

//   socket.on(STEP.RELAY_SDP, ({ peerID, sessionDescription }) => {
//     io.to(peerID).emit(STEP.SESSION_DESCRIPTION, {
//       peerID: socket.id,
//       sessionDescription,
//     });
//   });

//   socket.on(STEP.RELAY_ICE, ({ peerID, iceCandidate }) => {
//     io.to(peerID).emit(STEP.ICE_CANDIDATE, {
//       peerID: socket.id,
//       iceCandidate,
//     });
//   });
// });

app.use(errorLogger);
app.use('*', (req, res, next) => next(new NotFound(resourceNotFound)));
app.use(errors());
app.use(errorMiddleware);

// serverWS.listen(PORT_WS, () => {
//   // eslint-disable-next-line no-console
//   console.log(`Begin ws listening ${PORT_WS} ${NODE_ENV}`);
// });

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Begin app listening ${PORT} ${NODE_ENV}`);
});

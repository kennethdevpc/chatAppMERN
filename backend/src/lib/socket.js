import { Server } from 'socket.io';
import http from 'http';
import express from 'express';

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ['http://localhost:5173'],
    // methods: ['GET', 'POST'],
    // credentials: true,
  },
});
export function getReceiverSocketId(userId) {
  return userSocketMap[userId]; //---se obtiene el socket del usuario
}
// used to store online users
const userSocketMap = {}; // {userId: socketId}

//----Se crea la conexion con el socket y se obtienen datos del usuario
io.on('connection', (socket) => {
  console.log('a user connected, with socket: ', socket.id);

  const { userId, otherYouWant } = socket.handshake.query;
  if (userId) userSocketMap[userId] = socket.id; //---se llena el objeto con el id del usuario y el socket

  // io.emit() es usado para enviar eventos a todos los clientes conectados
  io.emit('getOnlineUsers', Object.keys(userSocketMap));

  socket.on('disconnect', () => {
    console.log('backend, user disconnected socket: ', socket.id);
    delete userSocketMap[userId];
    io.emit('getOnlineUsers', Object.keys(userSocketMap)); //---al desconectarre debe quitar el usuario de los usuarios conectados y enviar la lista actualizada
  });
});
export { io, app, server };

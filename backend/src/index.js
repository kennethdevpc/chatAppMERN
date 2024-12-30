import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import path from 'path'; //----importo path, de node - "configuracion para produccion"
import { connectDB } from './lib/db.js';

import authRoutes from './routes/auth.route.js';
import messageRoutes from './routes/messageRoutes.route.js';
import { app, server } from './lib/socket.js';

// const app = express();//----se llama en el archivo socket.js

dotenv.config();
const PORT = process.env.PORT;
const __dirname = path.resolve(); //----creo una variable para guardar la ruta del directorio actual -"configuracion para produccion"

app.use(express.json({ limit: '50mb' }));
app.use(cookieParser());
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));

// app.get('/', (req, res) => {
//   res.send('hola');
// });
app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);

//----------"configuracion para produccion"
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/dist'))); //---entonces aqui usa los archivos estaticos

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../frontend', 'dist', 'index.html'));
  });
}

//--------se usa el server que se creo en el archivo socket.js
// app.listen(PORT, () => {
server.listen(PORT, () => {
  console.log('Server is running on port ', PORT, `http://localhost:${PORT}/`);
  connectDB(); //------conecto la base de datos
});

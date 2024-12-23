import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
dotenv.config();
import { connectDB } from './lib/db.js';

import authRoutes from './routes/auth.route.js';
import messageRoutes from './routes/messageRoutes.route.js'; //----importo las rutas para mensajes
const app = express();
const PORT = process.env.PORT;

app.use(express.json({ limit: '50mb' }));
app.use(cookieParser());
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));

app.get('/', (req, res) => {
  res.send('hola');
});
app.use('/api/auth', authRoutes);
app.use('/api/auth', messageRoutes); //---------uso la ruta de mensajes

app.listen(PORT, () => {
  console.log('Server is running on port ', PORT, `http://localhost:${PORT}/`);
  connectDB(); //------conecto la base de datos
});

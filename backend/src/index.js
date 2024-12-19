import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import { connectDB } from './lib/db.js'; //---importo la conexion a la base de datos

import authRouters from './routes/auth.route.js';
const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.get('/', (req, res) => {
  res.send('hola');
});
app.use('/api/auth', authRouters);

app.listen(PORT, () => {
  console.log('Server is running on port ', PORT);
  connectDB(); //------conecto la base de datos
});

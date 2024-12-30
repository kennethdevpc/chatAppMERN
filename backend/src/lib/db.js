import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
    // Eliminar toda la base de datos
    // await conn.connection.dropDatabase();
    // console.log('Database has been dropped');
  } catch (error) {
    console.log('MongoDB connection error:', error);
  }
};

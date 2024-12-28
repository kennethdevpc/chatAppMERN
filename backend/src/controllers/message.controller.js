import User from '../models/user.model.js';
import Message from '../models/message.model.js';

import cloudinary from '../lib/cloudinary.js';
import { getReceiverSocketId, io } from '../lib/socket.js';

export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    //---Busca todos los usuarios cuyo ID (_id) no sea igual ($ne) al ID del usuario actualmente autenticado (loggedInUserId)."
    const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select('-password'); //Indica que los resultados devueltos No deben incluir (-) el campo password de los usuarios

    res.status(200).json(filteredUsers);
  } catch (error) {
    console.error('Error in getUsersForSidebar: ', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getMessages = async (req, res) => {
  try {
    //----destructuring del ID, pero le a un nombre userToChatId
    const { id: userToChatId } = req.params; //----request por params
    const myId = req.user._id; //----request por user que esta logueado, se crea cuando se loguea, en el middleware "protectRoute"

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId }, //--mensajes si soy yo el remitente y el destinatario
        { senderId: userToChatId, receiverId: myId }, //--mensajes si soy yo el destinatario y el remitente
      ],
    });

    res.status(200).json(messages);
  } catch (error) {
    console.log('Error in getMessages controller: ', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    let imageUrl;
    if (image) {
      // Upload base64 image to cloudinary
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    await newMessage.save();
    //----real time functionality para envio de mensajes en tiempo real
    const receiverSocketId = getReceiverSocketId(receiverId); //----recibe el socket del usuario receptor
    if (receiverSocketId) {
      //----si el socket existe, significa que esta conectado, y por lo tanto envia el mensaje
      io.to(receiverSocketId).emit('newMessage', newMessage); //----envia el mensaeje solo a un usuario
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.log('Error in sendMessage controller: ', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

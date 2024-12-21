# chatAppMERN

# EXTENSIONES

- VScoe great icons

- # backend
- # 1)

  - ```terminal
     npm init -y
    ```

  - ```terminal
      npm i express mongoose dotenv jsonwebtoken bcrypt csurf cookie-parser cloudinary socket.io
    ```
  - ```terminal
      npm i D nodemon
    ```

- # 2) colocar el src index en una carpeta src
  - #### u : `backend/src/index.js`
- # 3)

  - ##### U: `backend/package.json`

  ```json

  //--para Ecmascript par aimporta entonces defino type

  {
  ....
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "dev": "nodemon src/index.js" //----se define el modo de para ejecutar el primer index
  },
  "keywords": [],
  "author": "",
  "type": "module", //----se define type

  ```

- # 4) inicio el servidor:

  ```js
  import express from 'express';
  const app = express();
  app.listen(5000, () => {
    console.log('Server is running on port 5000');
  });
  ```

  ```terminal
    npm run dev
  ```

  - [http://localhost:5000/]

- # 5 creando rutas

  - #### u: `backend/src/routes/auth.route.js`

    ```js
    import express from 'express';
    const router = express.Router();

    router.get('/', (req, res) => {
      res.send('auth');
    });

    export default router;
    ```

  - ## 5.2) llamado en el index

    - #### u: `backend/src/index.js`

    ```js
    import express from 'express';
    import authRouters from './routes/auth.route.js';
    const app = express();

    //ojo si uso app.get llama una ruta unica
    app.get('/', (req, res) => {
      res.send('hola');
    });
    //debo usar el .use  ya que asi puede llamar a todas las rutas

    app.use('/api/auth', authRouters);

    app.listen(5000, () => {
      console.log('Server is running on port 5000');
    });
    ```

    [http://localhost:5000/api/auth/checke](http://localhost:5000/api/auth/checke)
    obtendras
    `check`

- # 6 creando controladores

  - #### u : `backend/src/controllers/auth.controller.js`

  ```js
  export const signup = async (req, res) => {
    const { fullName, email, password } = req.body;
  };

  export const login = async (req, res) => {
    const { email, password } = req.body;
  };

  export const logout = (req, res) => {};

  export const updateProfile = async (req, res) => {};

  export const checkAuth = (req, res) => {};
  ```

  - ## 6.2) la imprto en las rutas:

    - #### u : `backend/src/routes/auth.route.js`

    ```js
    import express from 'express';
    import {
      checkAuth,
      logout,
      signup,
      updateProfile,
      login,
    } from '../controllers/auth.controller.js';
    const router = express.Router();

    router.post('/signup', signup);
    router.post('/login', login);
    router.post('/logout', logout);
    router.put('/update-profile', updateProfile);
    router.get('/check', checkAuth);

    export default router;
    ```

- # 7 ahora antes de comenzar con el control voy a crear el MongoDB

  voy a la pagina y creo un nuevo proyecto
  [https://cloud.mongodb.com/](https://cloud.mongodb.com/)

  - sigo las 5mg images y me aseguro de copiar lo que esta en limagen 7mg clave.url:
    [https://www.mongodb.com/docs/manual/reference/connection-string-examples/](https://www.mongodb.com/docs/manual/reference/connection-string-examples/)
  - ## 7.2) creo el .env `backend/.env`

    - chatAppDB: es el nombre que unao qquiera para la base de datos

    ```env
      MONGODB_URI=mongodb+srv://""ussssser"":"dddddclave"@cluster0.jaken.mongodb.net/chatAppDB?retryWrites=true&w=majority&appName=Cluster0
      PORT=5001
      JWT_SECRET=...

      CLOUDINARY_CLOUD_NAME=...
      CLOUDINARY_API_KEY=...
      CLOUDINARY_API_SECRET=...

      NODE_ENV=development
    ```

  - ## 7.3 ) voy al index y modifico el archivo

    ```js
    import express from 'express';
    import dotenv from 'dotenv'; //----dotenv
    dotenv.config(); //------dotenv.config();
    import authRouters from './routes/auth.route.js';

    const app = express();

    const PORT = process.env.PORT; //----uso de dotenv

    app.get('/', (req, res) => {
      res.send('hola');
    });

    app.use('/api/auth', authRouters);

    app.listen(PORT, () => {
      console.log('Server is running on port ', PORT);
    });
    ```

- # 8) ahora si uso y conecto la base de datos: `backend/src/lib/db.js`

  -¿Qué contiene típicamente lib? Funciones de utilidad (helpers).Módulos personalizados o adaptaciones de librerías externas. Clases u objetos relacionados con la lógica del negocio o Infraestructura.

  - CONEXION A LA BASE DE DATOS

  ```js
  import mongoose from 'mongoose';
  export const connectDB = async () => {
    try {
      const conn = await mongoose.connect(process.env.MONGODB_URI);
      console.log(`MongoDB connected: ${conn.connection.host}`);
    } catch (error) {
      console.log('MongoDB connection error:', error);
    }
  };
  ```

  - ## 8.2) para conectarlo ire a `backend/src/index.js`

    ```js
    import express from 'express';
    import dotenv from 'dotenv';
    dotenv.config();
    import { connectDB } from './lib/db.js'; //---importo la conexion a la base de datos

    import authRouters from './routes/auth.route.js';
    const app = express();
    const PORT = process.env.PORT;
    app.get('/', (req, res) => {
      res.send('hola');
    });
    app.use('/api/auth', authRouters);

    app.listen(PORT, () => {
      console.log('Server is running on port ', PORT);
      connectDB(); //------conecto la base de datos
    });
    ```

    - EN la terminal se mostrara esto: que significa que ya s conecto

    ```terminal
        Server is running on port  5001
        MongoDB connected: cluster0-shard-00-01.jaken.mongodb.net
    ```

  - ## 8.3) voy al "network access" n la imagen 8 y activo

    ![alt text](images/8mg.png)

  - ## 8.4) voy al cluster
    ![alt text](images/9mg.png)

- # 9) Creando los modelos: `backend/src/models/user.model.js`

  - hay que tener en cuenta que MongoDB automaticamente genera iun "id" sin embargo lo genera como "\_id"
  - similar a punto 17 aqui [cursoNode](https://github.com/kennethdevpc/projectNodeBR/blob/master/pasos2024.txt#L2334)

  ```js
  import mongoose from 'mongoose';

  const userSchema = new mongoose.Schema(
    {
      email: {
        type: String,
        required: true,
        unique: true,
      },
      fullName: {
        type: String,
        required: true,
      },
      password: {
        type: String,
        required: true,
        minlength: 6,
      },
      profilePic: {
        type: String,
        default: '',
      },
    },
    { timestamps: true }
  );
  //------el modelo se crea en singular siempre y con la primera letra mayuscula, por ejemplo User para users
  const User = mongoose.model('User', userSchema);

  export default User;
  ```

- # 10) desbo usar antes que todo `backend/src/index.js`

  ```js
    ....//rutas
    app.use(express.json());

  ```

- # 11) ahora si el uso del modelo para la creacion y duardado en DB uso JWT y Cookie

  - el hasheo es similar al punto 21: [cursoNode](https://github.com/kennethdevpc/projectNodeBR/blob/master/pasos2024.txt#L2334)

    - en MySql es diferencte la creacion con ORM "Mongoose" :

      - #### Usando Mongoose

        -informacion de queryes y operadores:

        - [operator](https://www.mongodb.com/docs/manual/reference/operator/query-comparison/)
        - [CRUD MOngose](https://www.mongodb.com/docs/drivers/node/current/fundamentals/crud/)
        - [mongo con Node ](https://www.mongodb.com/docs/drivers/node/current/)
        - [mas info] (https://github.com/kennethdevpc/chatAppMERN/blob/main/ObjetoReq.md)

        - Mongoose es una capa de abstracción sobre la biblioteca nativa de MongoDB. Simplifica la interacción al agregar: Modelos y esquemas para estructurar tus datos. Métodos para trabajar con la base de datos usando estos modelos.
        - **MongoDB:** : la biblioteca oficial que interactúa directamente con MongoDB. Aquí tú mismo gestionas todas las operaciones (e.g., conexión, creación de documentos, consultas) sin un nivel adicional de abstracción.

    ```js
    const usuario = await Usuario.create({
      nombre,
      email,
      password,
    });
    ```

    -como nota importante es que en ese proyecto se uso helpers en vez de la carpeta Lib, sin embargo el helper , se que se usa en este proyecto, esto con el fin ve tener una estructura mas moderna con el lib

    - ## 11.1) creo la plalabra clave para el utils.js: `backend/src/lib/utils.js`

      y evitando cross and request, y cookie tal como en el punto 24, y JWT( json web token) con cookie 28) [cursoNode](https://github.com/kennethdevpc/projectNodeBR/blob/master/pasos2024.txt#L2334)

      - primero creo en el .env la palabra secreta: **U: backend/.env**
        ```.env
        JWT_SECRET=cualquierPalabra
        ```

    - ## 11.2)creo el utils.js : `backend/src/lib/utils.js` Genero token

      ```js
      import jwt from 'jsonwebtoken';

      export const generateToken = (userId, res) => {
        const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
          expiresIn: '7d',
        });
        //------jwt solo sera un nombre puede ser como quiere qu ese lea
        res.cookie('jwt', token, {
          maxAge: 7 * 24 * 60 * 60 * 1000, // MS
          httpOnly: true, // prevent XSS attacks cross-site scripting attacks
          sameSite: 'strict', // CSRF attacks cross-site request forgery attacks
          secure: process.env.NODE_ENV !== 'development',
        });

        return token;
      };
      ```

- # 12) voy al cotrolador creo un usuario y un token:`backend/src/controllers/auth.controller.js`

  ```js
  //---signup
  export const signup = async (req, res) => {
    const { fullName, email, password } = req.body;
    try {
      if (!fullName || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
      }
      if (password.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters' });
      }
      const user = await User.findOne({ email });
      if (user) return res.status(400).json({ message: 'Email already exists' });
      const salt = await bcrypt.genSalt(10); //---Punto 21) del proyecto cursoNode
      const hashedPassword = await bcrypt.hash(password, salt);
      //--------------cre un nuevo usuario
      const newUser = new User({
        //--------En mongo se crea un new user, en mysql es con create,
        fullName,
        email,
        password: hashedPassword,
      });
      if (newUser) {
        //------------generate jwt token here
        generateToken(newUser._id, res);
        await newUser.save();
        res.status(201).json({
          _id: newUser._id,
          fullName: newUser.fullName,
          email: newUser.email,
          profilePic: newUser.profilePic,
        });
      } else {
        res.status(400).json({ message: 'Invalid user data' });
      }
    } catch (error) {
      console.log('Error in signup controller', error.message);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };
  ```

- # 13) probando en postman:

  ![imagen ](images/10pm.png)
  la cookie
  ![imagen2 Coockie ](images/10pm.png)

  - En Mongo debe dar asi:
    ![imagen ](images/11mg.png)

- # 14 DEBO AGREGAR EL cookieParser

  - #### u: `backend/src/index.js`

    ```js
    import express from 'express';
    import dotenv from 'dotenv';
    import cookieParser from 'cookie-parser'; //------importo el cookieparser
    dotenv.config();
    import { connectDB } from './lib/db.js';
    import authRouters from './routes/auth.route.js';
    const app = express();
    const PORT = process.env.PORT;

    app.use(express.json());
    app.use(cookieParser()); //---------usando el coookieParser
    app.get('/', (req, res) => {
      res.send('hola');
    });
    app.use('/api/auth', authRouters);
    app.listen(PORT, () => {
      console.log('Server is running on port ', PORT, `http://localhost:${PORT}/`);
      connectDB(); //------conecto la base de datos
    });
    ```

- # 14.1) voy al controlador y creo el resto de funcionalidades:

  - #### U: `backend/src/controllers/auth.controller.js`

  - ## 14.2) login

    Aqui hago el compare de bcryp, tal como en el punto 27.2) del proyecto [cursoNode](https://github.com/kennethdevpc/projectNodeBR/blob/master/pasos2024.txt#L2334)

    ```js
    export const login = async (req, res) => {
      const { email, password } = req.body;
      try {
        const user = await User.findOne({ email });

        if (!user) {
          return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
          return res.status(400).json({ message: 'Invalid credentials' });
        }

        generateToken(user._id, res);

        res.status(200).json({
          _id: user._id,
          fullName: user.fullName,
          email: user.email,
          profilePic: user.profilePic,
        });
      } catch (error) {
        console.log('Error in login controller', error.message);
        res.status(500).json({ message: 'Internal Server Error' });
      }
    };
    ```

    - probando en postman:
      - `http://localhost:5001/api/auth/login`

  - ## 14.3) logout

    ```js
    export const logout = (req, res) => {
      try {
        res.cookie('jwt', '', { maxAge: 0 });
        res.status(200).json({ message: 'Logged out successfully' });
      } catch (error) {
        console.log('Error in logout controller', error.message);
        res.status(500).json({ message: 'Internal Server Error' });
      }
    };
    ```

    - probando en postman:
      - `http://localhost:5001/api/auth/logout`

  - ## 14.3) updateProfile

    - para este es un poco diferente ya que, para actualizar el perfil debo estar previamente logueado o autenticado, por lo tanto voy a tener, que hacer un middleware para que se ejecute para la verificacion de la ruta

    ya que la ruta es esta: `backend/src/routes/auth.route.js`:

    ```js
    router.put('/update-profile', protectRoute, updateProfile);
    ```

    - ### 14.3.1) protectRoute creacion de middleware `**protectRoute**` `backend/src/middleware/auth.middleware.js`
      punto 41 aqui [cursoNode](https://github.com/kennethdevpc/projectNodeBR/blob/master/pasos2024.txt#L2334)

    ```js
    import jwt from 'jsonwebtoken';
    import User from '../models/user.model.js';

    export const protectRoute = async (req, res, next) => {
      try {
        const token = req.cookies.jwt;

        if (!token) {
          return res.status(401).json({ message: 'Unauthorized - No Token Provided' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded) {
          return res.status(401).json({ message: 'Unauthorized - Invalid Token' });
        }

        const user = await User.findById(decoded.userId).select('-password');

        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }

        req.user = user;

        next();
      } catch (error) {
        console.log('Error in protectRoute middleware: ', error.message);
        res.status(500).json({ message: 'Internal server error' });
      }
    };
    ```

  - ## 14.4) Hosting para imagenes y videos.

    - me dirijo a cloudinary
      [https://console.cloudinary.com](https://console.cloudinary.com/)
    - celr la imagen ![imagen ](images/12cl.png)
    - cloudinary hgenera una nueva key:
      celr la imagen ![imagen ](images/13cl.png)

    - ### ir al archivo `.env` y copio las claves

      ```.env
      CLOUDINARY_CLOUD_NAME=diep0nzvsfffss
      CLOUDINARY_API_KEY=6534111111111111
      CLOUDINARY_API_SECRET=jOnwDremjfjjjfjfjjfjfjjffjjfj
      ```

    - ### creo el archivo : `backend/src/lib/cloudinary.js`

      ```js
      import { v2 as cloudinary } from 'cloudinary';

      import { config } from 'dotenv';

      config();
      cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
      });
      export default cloudinary;
      ```

  - ## 14.5) updateProfile ahora si para ya agregarselo a la ruta

    ```js
    export const updateProfile = async (req, res) => {
      try {
        const { profilePic } = req.body;
        const userId = req.user._id;
        if (!profilePic) {
          return res.status(400).json({ message: 'Profile pic is required' });
        }
        const uploadResponse = await cloudinary.uploader.upload(profilePic);
        const updatedUser = await User.findByIdAndUpdate(
          userId,
          { profilePic: uploadResponse.secure_url },
          { new: true }
        );
        res.status(200).json(updatedUser);
      } catch (error) {
        console.log('error in update profile:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
    };
    ```

  - ## 14.6) creacion del check para ver si esta autenticado: `backend/src/controllers/auth.controller.js`

    - la ruta es:
      `router.get('/check', protectRoute, checkAuth); `

    ```js
    export const checkAuth = (req, res) => {
      try {
        res.status(200).json(req.user);
      } catch (error) {
        console.log('Error in checkAuth controller', error.message);
        res.status(500).json({ message: 'Internal Server Error' });
      }
    };
    ```

- # Mongodb:

  - [Query-document/](https://www.mongodb.com/docs/drivers/node/current/fundamentals/crud/query-document/)

- # 15) creacion del message

  - ## 15.1) creo el MODELO

    - #### u: `backend/src/models/message.model.js`

    ```js
    import mongoose from 'mongoose';

    const messageSchema = new mongoose.Schema(
      {
        senderId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        receiverId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        text: {
          type: String,
        },
        image: {
          type: String,
        },
      },
      { timestamps: true }
    );

    const Message = mongoose.model('Message', messageSchema);

    export default Message;
    ```

  - ## 15.2) creo la ruta en el index y luego en las rutas. `backend/src/index.js`

    ```js
    .....
    import messageRoutes from './routes/messageRoutes.route.js'; //----importo las rutas para mensajes
    .....
    app.use('/api/auth', authRoutes);
    app.use('/api/auth', messageRoutes); //---------uso la ruta de mensajes
    ```

    - ### 15.2.1) messageRoutes.route.js `backend/src/routes/messageRoutes.route.js`

      ```js
      import express from 'express';
      import { protectRoute } from '../middleware/auth.middleware.js';
      import {
        getMessages,
        getUsersForSidebar,
        sendMessage,
      } from '../controllers/message.controller.js';

      const router = express.Router();

      router.get('/users', protectRoute, getUsersForSidebar);
      router.get('/:id', protectRoute, getMessages);

      router.post('/send/:id', protectRoute, sendMessage);

      export default router;
      ```

  - ## 15.3) creo el controlador para `getMessages, getUsersForSidebar, sendMessage`

    - #### u: `backend/src/controllers/message.controller.js`

    - ## 15.3.1) getUsersForSidebar **toma todo los usuarios y los muestra en el sidebar**

      - ruta: `router.get('/users', protectRoute, getUsersForSidebar);`

      ```js
      export const getUsersForSidebar = async (req, res) => {
        try {
          const loggedInUserId = req.user._id;
          //---Busca todos los usuarios cuyo ID (_id) no sea igual ($ne) al ID del usuario actualmente autenticado (loggedInUserId)."
          const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select(
            '-password'
          ); //Indica que los resultados devueltos No deben incluir (-) el campo password de los usuarios

          res.status(200).json(filteredUsers);
        } catch (error) {
          console.error('Error in getUsersForSidebar: ', error.message);
          res.status(500).json({ error: 'Internal server error' });
        }
      };
      ```

    - ## 15.3.2) **toma el 1 usuario del chat sidebar y prosede a mostrar ese chat**

      - ruta: `router.get('/:id', protectRoute, getMessages);`

      ```js
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
      ```

    - ## 15.3.3) **envio de mensaje a un usuario del navbar**

      - ruta: `router.post('/send/:id', protectRoute, sendMessage);`

      ```js
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
          //----real time functionality se trabaja despues

          res.status(201).json(newMessage);
        } catch (error) {
          console.log('Error in sendMessage controller: ', error.message);
          res.status(500).json({ error: 'Internal server error' });
        }
      };
      ```

  ```

  ```

```

```

```

```

```

```

```

```

```

- #
```

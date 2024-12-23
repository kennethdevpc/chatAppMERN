# chatAppMERN

- estoy usando Sniped (es7)
- vscode great icons
- Tailwind CSS IntelliSense

# BBACKEND

<details>
      <summary style="font-weight: bold; text-decoration: underline; cursor: pointer;">💥 capitulo 1 -backend 💥</summary>

- # Boilerplate: backend

  - # 1)

    - ## EXTENSIONES

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
    import { generateToken } from '../lib/utils.js';
    import User from '../models/user.model.js';
    import bcrypt from 'bcrypt';
    import cloudinary from '../lib/cloudinary.js';

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

          //----actualizo el user, con la nueva profilePicture(profilePic)
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

- # 16) configurar las cors para evitar que salga ese error:

  ![cors](images/14cors.png)

  ```terminal
  npm i cors
  ```

  - #### u : `backend/src/index.js`

  ```js
  import cors from 'cors';
  app.use(express.json());
  app.use(cookieParser());
  app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
  ```

</details>

- # FRONTEND

    <!-- <details>
        <summary style="font-weight: bold; text-decoration: underline; cursor: pointer;">💥 capitulo 2- Frontend💥</summary> -->

- # Boilerplate: Frontend `frontend`

- # 1) instalaciones adicionales

  ```terminal
  npm i react-router-dom react-hot-toast
  ```

  - `react-hot-toast:` para mostrar mensajes de error en el frontend, de una manera mas presentable

  - `react-router-dom:` para manejar rutasdebo colocar el "toaster" en el app principal `App.js`

  ```tsx

  import { Toaster } from 'react-hot-toast';
  function App() {
    .......

    return (
      <div className="text-red-500">
      <!-- ------asi se coloca el toaster para que se muestre en toda la app los errores -->
        <Toaster />

        <Navbar />
        .......
      </div>
    );
  }

  export default App;
  ```

  - ## instalar tailwind

  ```terminal
  npm install -D tailwindcss postcss autoprefixer
  npx tailwindcss init -p

  ```

  - ### configuracion tailwind `frontend/tailwind.config.js`
    ```js
    /** @type {import('tailwindcss').Config} */
    export default {
      content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
      theme: {
        extend: {},
      },
      plugins: [],
    };
    ```
    - ### `./src/index.css`
      ```css
      @tailwind base;
      @tailwind components;
      @tailwind utilities;
      ```
  - ## instalacion de daisy UI: (daisyui)[https://daisyui.com/docs/install/]

    ```terminal
    npm i -D daisyui@latest
    ```

  - ## instalacion de axios :

    ```terminal
     npm i axios
    ```

  - ## instalacion zustand: para manejar estados de estado

    ```terminal
     npm i zustand
    ```

    - ### configuracion tailwind `frontend/tailwind.config.js`

    ```js
    /** @type {import('tailwindcss').Config} */
    import daisyui from 'daisyui'; //---> import the plugin de daisyui
    export default {
      content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
      theme: {
        extend: {},
      },
      plugins: [daisyui], // add the plugin to the config
    };
    ```

  - importaciones el "@":
    se puede configurar el tsconfig.json para que me deje usar en las importaciones el "@"
    ```json
    {
      "compilerOptions": {
        "baseUrl": "./",
        "paths": {
          "@/*": ["./src/*"]
        }
      }
    }
    ```
    - Esto me permite importar los componentes de la carpeta src sin tener que poner "./src/..."

- # 1.1) configuracion de axios para poder hacer peticiones a la API

  - se realiza una instancia con la url base de la API, para poder hacer peticiones a la API sin que se tenga que poner la url completa en cada peticion
    **por ejemplo :** axiosInstance.get('/users'), o tmabien axiosInstance.post('/users', { name: 'John' }).

  - ##### u: `frontend/src/lib/axios.ts`

    ```ts
    import axios from 'axios';

    export const axiosInstance = axios.create({
      baseURL: import.meta.env.MODE === 'development' ? 'http://localhost:5001/api' : '/api',
      withCredentials: true,
    });
    ```

- # 1.2) configuracion de loaders con lucide
  ```terminal
    npm i lucide-react
  ```
- # 1.3) configuracion eslint:

  si esta trabajando con js, sile pone errores de tipado, valla al archivo: `frontend/.eslintrc.cjs`

  ```cjs
        rules: {
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      "react/prop-types": "off",
    },
  }

  ```

- # 2) inicio del proyecto

  - #### u: `frontend/src/main.tsx`

    ```tsx
    import React from 'react';
    import ReactDOM from 'react-dom/client';
    import App from './App.tsx';
    import './index.css';
    import { BrowserRouter } from 'react-router-dom'; //---envuelvo la app en el BrowserRouter, para que las rutas funcionen

    ReactDOM.createRoot(document.getElementById('root')!).render(
      <React.StrictMode>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </React.StrictMode>
    );
    ```

- # 3) configuracion de rutas

  - #### `frontend/src/App.tsx`

    ```tsx
    import Navbar from './components/Navbar';
    import { Routes, Route } from 'react-router-dom'; //---importo la funcionalidad de rutas
    function App() {
      return (
        <div className="text-red-500">
          <Navbar />
          //--------aqui envuelvo las rutas, usando el Routes
          <Routes>
            <Route path="/" element={<h1>Home</h1>} />
            <Route path="/about" element={<h1>About</h1>} />
            <Route path="/contact" element={<h1>Contact</h1>} />
          </Routes>
        </div>
      );
    }

    export default App;
    ```

- # 4) creo los compoentes de las rutas

  `frontend/src/pages`
  [HomePage](frontend/src/pages/HomePage.tsx) [LoginPage](frontend/src/pages/LoginPage.tsx) [ProfilePage](frontend/src/pages/ProfilePage.tsx) [SettingsPage](frontend/src/pages/SettingsPage.tsx) [SignUpPage]
  (frontend/src/pages/SignUpPage.tsx)

  - Agrego esos componentes a las rutas: `frontend/src/App.tsx`

  ```tsx
  import Navbar from './components/Navbar';
  import { Routes, Route } from 'react-router-dom';
  import HomePage from './pages/HomePage';
  import SignUpPage from './pages/SignUpPage';
  import LoginPage from './pages/LoginPage';
  import SettingsPage from './pages/SettingsPage';
  import ProfilePage from './pages/ProfilePage';
  function App() {
    return (
      <div className="text-red-500">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </div>
    );
  }

  export default App;
  ```

- # 5) antes de seguir con cada ruta voy a configurar `zustand` para poder manejar el estado de la app

  - ## teoira Zustand:
    Qué Hace Cada Parte

  1. create:
     create es la función principal de Zustand para crear un `"store"`. Un "store" en este contexto es simplemente un lugar donde se guarda información que puede ser compartida entre componentes.

  2. (set, get)
     La función `(set, get)` que pasamos a create define dos herramientas clave:

     **set:** Sirve para modificar el estado. Piensa en él como una forma de decirle a Zustand: "Oye, cambia este valor en el store".

     **get:** Sirve para `consultar el estado actual dentro del store.` Es como una forma rápida de leer los datos directamente desde el store.

     - Ejemplo básico para que quede claro:

       - creo el store

       ```tsx
       import { create } from 'zustand';

       export const useAuthStore = create((set, get) => ({
         // Estado inicial
         authUser: null,
         isCheckingAuth: true,
         // Acción para modificar el estado
         login: (user) => set({ authUser: user, isCheckingAuth: false }),
         logout: () => set({ authUser: null, isCheckingAuth: false }),
         // Usar get para obtener un valor actual del estado
         isUserLoggedIn: () => !!get().authUser, // Retorna true si authUser no es null
       }));
       ```

       - Uso el store en el componente:

       ```tsx
       import React from 'react';
       import { useAuthStore } from './path-to-store';

       const AuthStatus = () => {
         const { authUser, isCheckingAuth, login, logout } = useAuthStore();

         if (isCheckingAuth) {
           return <div>Checking authentication...</div>;
         }

         return (
           <div>
             {authUser ? (
               <>
                 <p>Welcome, {authUser.name}!</p>
                 <button onClick={logout}>Log Out</button>
               </>
             ) : (
               <>
                 <p>No user is logged in.</p>
                 <button onClick={() => login({ name: 'John Doe' })}>Log In</button>
               </>
             )}
           </div>
         );
       };

       export default AuthStatus;
       ```

  - ## 5.1) - creo la carpeta `store` y dentro de ella creo los archivos para manejar el estado de la app

  - ##### `frontend/src/store/useAuthStore.ts`

    ```tsx
    import { create } from 'zustand';
    import { axiosInstance } from '../lib/axios.js';
    interface AuthStore {
      authUser: { _id: string; fullName: string; email: string } | null;
      isSigningUp: boolean;
      isLoggingIn: boolean;
      isUpdatingProfile: boolean;
      isCheckingAuth: boolean;
    }

    export const useAuthStore = create<AuthStore>((set, get) => ({
      authUser: null,
      isSigningUp: false,
      isLoggingIn: false,
      isUpdatingProfile: false,
      isCheckingAuth: true,

      checkAuth: async () => {
        try {
          //-----uso de axiosInstance para hacer peticiones al servidor, se usa asi porque ya se configuro el baseURL en el archivo axios.js
          //----para meterle primero los datos de prueba es decir loguearse-------
          //const a = { fullName: 'kenneth', email: 'ken@gmail.com', password: '1234567' };
          //const res = await axiosInstance.post('/auth/login', a);
          //console.log('usuario logueado:', res);
          //-----para checar si estoy logueado y ver el usuario
          const res: { data: { _id: string; fullName: string; email: string } } =
            await axiosInstance.get('/auth/check');
          console.log('datos usuario logueado:', res);
          set({ authUser: res.data });
        } catch (error) {
          console.log('Error in checkAuth:', error);
          set({ authUser: null });
        } finally {
          set({ isCheckingAuth: false });
        }
      },
    }));
    ```

  - ## 5.2) uso del store en los componentes de la app por ejemplo para la prueba en app

    - #### u : `frontend/src/App.tsx`

      ```tsx
      function App() {
        const { authUser, checkAuth } = useAuthStore();
        const prueba = async () => {
          await checkAuth();
        };
        useEffect(() => {
          checkAuth();
        }, [checkAuth]);
        console.log('el usuario es:', authUser);
      ```

  - ## 5.3) uso del Loader con lucide react, recuerda que se instalo en el punto 1.2)

    - lo usamos en el compoenente `App.tsx`

    ```tsx
    ...
    import { Loader } from 'lucide-react';

    function App() {
      const { authUser, checkAuth, isCheckingAuth } = useAuthStore();

      useEffect(() => {
        checkAuth();
      }, [checkAuth]);
      console.log('el usuario es:', authUser);
      //---usando el loader para mostrar mientras se verifica la autenticacion
      if (isCheckingAuth && !authUser)
        return (
          <div className="flex items-center justify-center h-screen">
            <Loader className="size-10 animate-spin" />
          </div>
        );

      return (
        <div className="text-red-500">
          ....
        </div>
      );
    }

    export default App;
    ```

- # 6) proteccion de las rutas con react-router-dom

  - #### `frontend/src/App.tsx`

            ```tsx

            import { Routes, Route, Navigate } from 'react-router-dom';

            function App() {
            return (

              <div className="text-red-500">
                <Navbar />
                <Routes>
                    //------aqui envuelvo las rutas y por ejemplo las rutas de login al
                    //------si no esta autenticado va a la pagina de login
                     <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/login" />} />
                    <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/" />} />
                    <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
                    <Route path="/settings" element={<SettingsPage />} />
                    <Route path="/profile" element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />

                </Routes>
              </div>
            )        }
            ```

    Despues de conocerse lo anterior ahora s eprocede a formalizar los componentes de la app

- # 7) componente `signup` : `frontend/src/pages/SignUpPage.tsx`

  - primero creo el en el store, el estado signup: `frontend/src/store/useAuthStore.ts`

    ```tsx
    signup: async (data) => {
      set({ isSigningUp: true });
      try {
        const res = await axiosInstance.post('/auth/signup', data);
        console.log('res:', res);
        set({ authUser: res.data });
        toast.success('Account created successfully');
        // get().connectSocket();
      } catch (error) {
        //  toast.error(error.response.data.message);
        toast.error((error as Error).message);
      } finally {
        set({ isSigningUp: false });
      }
    },

    ```

  - luego en `frontend/src/pages/SignUpPage.tsx`

    ```tsx
    import { useState } from 'react';
    import { Eye, EyeOff, Loader2, Lock, Mail, MessageSquare, User } from 'lucide-react';
    import { Link } from 'react-router-dom';

    import toast, { Toaster } from 'react-hot-toast';
    import { useAuthStore } from '../store/useAuthStore';
    import AuthImagePattern from '../components/AuthImagePattern';

    const SignUpPage = () => {
      const [showPassword, setShowPassword] = useState(false);
      const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
      });

      const { signup, isSigningUp } = useAuthStore();

      const validateForm = () => {
        if (!formData.fullName.trim()) return toast.error('Full name is required');
        if (!formData.email.trim()) return toast.error('Email is required');
        if (!/\S+@\S+\.\S+/.test(formData.email)) return toast.error('Invalid email format');
        if (!formData.password) return toast.error('Password is required');
        if (formData.password.length < 6)
          return toast.error('Password must be at least 6 characters');

        return true;
      };

      const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const success = validateForm();

        if (success === true) signup(formData);
      };

      return (
        <div className="min-h-screen grid lg:grid-cols-2">
          <Toaster />
          {/* left side */}
          <div className="flex flex-col justify-center items-center p-6 sm:p-12">
            <div className="w-full max-w-md space-y-8">
              {/* LOGO */}
              <div className="text-center mb-8">
                <div className="flex flex-col items-center gap-2 group">
                  <div
                    className="size-12 rounded-xl bg-primary/10 flex items-center justify-center 
                  group-hover:bg-primary/20 transition-colors"
                  >
                    <MessageSquare className="size-6 text-primary" />
                  </div>
                  <h1 className="text-2xl font-bold mt-2">Create Account</h1>
                  <p className="text-base-content/60">Get started with your free account</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Full Name</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="size-5 text-base-content/40" />
                    </div>
                    <input
                      type="text"
                      className={`input input-bordered w-full pl-10`}
                      placeholder="John Doe"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Email</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="size-5 text-base-content/40" />
                    </div>
                    <input
                      type="email"
                      className={`input input-bordered w-full pl-10`}
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Password</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="size-5 text-base-content/40" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className={`input input-bordered w-full pl-10`}
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="size-5 text-base-content/40" />
                      ) : (
                        <Eye className="size-5 text-base-content/40" />
                      )}
                    </button>
                  </div>
                </div>

                <button type="submit" className="btn btn-primary w-full" disabled={isSigningUp}>
                  {isSigningUp ? (
                    <>
                      <Loader2 className="size-5 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    'Create Account'
                  )}
                </button>
              </form>

              <div className="text-center">
                <p className="text-base-content/60">
                  Already have an account?{' '}
                  <Link to="/login" className="link link-primary">
                    Sign in
                  </Link>
                </p>
              </div>
            </div>
          </div>

          {/* right side */}

          <AuthImagePattern
            title="Join our community"
            subtitle="Connect with friends, share moments, and stay in touch with your loved ones."
          />
        </div>
      );
    };
    export default SignUpPage;
    ```

  - ### 7.1) creo el componete `AuthImagePattern`: `frontend/src/components/AuthImagePattern.tsx`

    - Es un componente que se creara para mostrar a la derecha los cuadritos

    ```tsx
    import React from 'react';

    type Props = {
      title: string;
      subtitle: string;
    };

    function AuthImagePattern({ title, subtitle }: Props) {
      return (
        <div className="hidden lg:flex items-center justify-center bg-base-200 p-12">
          <div className="max-w-md text-center">
            <div className="grid grid-cols-3 gap-3 mb-8">
              {[...Array(9)].map((_, i) => (
                <div
                  key={i}
                  className={`aspect-square rounded-2xl bg-primary/10 ${
                    i % 2 === 0 ? 'animate-pulse' : ''
                  }`}
                />
              ))}
            </div>
            <h2 className="text-2xl font-bold mb-4">{title}</h2>
            <p className="text-base-content/60">{subtitle}</p>
          </div>
        </div>
      );
    }

    export default AuthImagePattern;
    ```

  - ### 7.2 si voy al fomrulario y lleno me debe de mandar a

    la ruta: `homepage`, ya que se ajusto en `frontend/src/App.tsx`

    ```tsx
    <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/" />} />
    ```

    - ademas en las cookies debe aparecer el token de "jwt"

    ![imagen15](images/15signup.png)

- # 8) componente `logout`

  - primero creo el en el store, el estado logout: `frontend/src/store/useAuthStore.ts`

    ```tsx
        logout: async () => {
        try {
          await axiosInstance.post('/auth/logout');
          set({ authUser: null });
          toast.success('Logged out successfully');
          // get().disconnectSocket();
        } catch (error) {
          toast.error((error as Error).message);
          // toast.error(error.response.data.message);
        }
      },
    ```

  - luego en `frontend/src/components/Navbar.tsx`

  ```tsx
  import { Link } from 'react-router-dom';
  import { useAuthStore } from '../store/useAuthStore';
  import { LogOut, MessageSquare, Settings, User } from 'lucide-react';

  const Navbar = () => {
    const { logout, authUser } = useAuthStore();

    return (
      <header
        className="bg-base-100 border-b border-base-300 fixed w-full top-0 z-40 
        backdrop-blur-lg bg-base-100/80"
      >
        <div className="container mx-auto px-4 h-16">
          <div className="flex items-center justify-between h-full">
            <div className="flex items-center gap-8">
              <Link to="/" className="flex items-center gap-2.5 hover:opacity-80 transition-all">
                <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-primary" />
                </div>
                <h1 className="text-lg font-bold">Chatty</h1>
              </Link>
            </div>

            <div className="flex items-center gap-2">
              <Link
                to={'/settings'}
                className={`
                  btn btn-sm gap-2 transition-colors
                  
                  `}
              >
                <Settings className="w-4 h-4" />
                <span className="hidden sm:inline">Settings</span>
              </Link>

              {authUser && (
                <>
                  <Link to={'/profile'} className={`btn btn-sm gap-2`}>
                    <User className="size-5" />
                    <span className="hidden sm:inline">Profile</span>
                  </Link>

                  <button className="flex gap-2 items-center" onClick={logout}>
                    <LogOut className="size-5" />
                    <span className="hidden sm:inline">Logout</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>
    );
  };
  export default Navbar;
  ```

  ![16LoginNavbar](images/16LoginNavbar.png)

- # 8) componente `login`

  - primero creo el en el store, el estado logout: `frontend/src/store/useAuthStore.ts`

    ```jsx
    interface AuthStore {
      authUser: { _id: string; fullName: string; email: string } | null;
      isSigningUp: boolean;
      isLoggingIn: boolean;
      isUpdatingProfile: boolean;
      isCheckingAuth: boolean;
      onlineUsers: string[];
      socket: ReturnType<typeof io> | null;
      checkAuth: () => Promise<void>;
      signup: (data: { fullName: string; email: string; password: string }) => Promise<void>;
      login: (data: { email: string; password: string }) => Promise<void>;
      logout: () => Promise<void>;
       updateProfile: (data: { name?: string; email?: string; password?: string }) => Promise<void>;
       connectSocket: () => void;
       disconnectSocket: () => void;
    }
    export const useAuthStore = create<AuthStore>((set, get) => ({
      login: async (data) => {
        set({ isLoggingIn: true });
        try {
          const res = await axiosInstance.post('/auth/login', data);
          set({ authUser: res.data });
          toast.success('Logged in successfully');

          // get().connectSocket();
        } catch (error) {
          // toast.error(error.response.data.message);
          toast.error((error as Error).message);
        } finally {
          set({ isLoggingIn: false });
        }
      },
    }));

    ```

  - luego en `frontend/src/pages/LoginPage.tsx`

    ```jsx
    import { useState } from 'react';
    import { useAuthStore } from '../store/useAuthStore';
    import AuthImagePattern from '../components/AuthImagePattern';
    import { Link } from 'react-router-dom';
    import { Eye, EyeOff, Loader2, Lock, Mail, MessageSquare } from 'lucide-react';

    const LoginPage = () => {
      const [showPassword, setShowPassword] = useState(false);
      const [formData, setFormData] = useState({
        email: '',
        password: '',
      });
      const { login, isLoggingIn } = useAuthStore();

      const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        login(formData);
      };

      return (
        <div className="h-screen grid lg:grid-cols-2">
          {/* Left Side - Form */}
          <div className="flex flex-col justify-center items-center p-6 sm:p-12">
            <div className="w-full max-w-md space-y-8">
              {/* Logo */}
              <div className="text-center mb-8">
                <div className="flex flex-col items-center gap-2 group">
                  <div
                    className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20
                  transition-colors"
                  >
                    <MessageSquare className="w-6 h-6 text-primary" />
                  </div>
                  <h1 className="text-2xl font-bold mt-2">Welcome Back</h1>
                  <p className="text-base-content/60">Sign in to your account</p>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Email</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-base-content/40" />
                    </div>
                    <input
                      type="email"
                      className={`input input-bordered w-full pl-10`}
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Password</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-base-content/40" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className={`input input-bordered w-full pl-10`}
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-base-content/40" />
                      ) : (
                        <Eye className="h-5 w-5 text-base-content/40" />
                      )}
                    </button>
                  </div>
                </div>

                <button type="submit" className="btn btn-primary w-full" disabled={isLoggingIn}>
                  {isLoggingIn ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    'Sign in'
                  )}
                </button>
              </form>

              <div className="text-center">
                <p className="text-base-content/60">
                  Don&apos;t have an account?{' '}
                  <Link to="/signup" className="link link-primary">
                    Create account
                  </Link>
                </p>
              </div>
            </div>
          </div>

          {/* Right Side - Image/Pattern */}
          <AuthImagePattern
            title={'Welcome back!'}
            subtitle={'Sign in to continue your conversations and catch up with your messages.'}
          />
        </div>
      );
    };
    export default LoginPage;
    ```

    ![17loginpage](images/17loginpage.png)

- # 9) componente `profile`

  - debo colocar la imagen avaar para el su uso en el "ProfilePage"

    - #### u : `frontend/public/avatar.png`
      ![images/19avatar.png](images/19avatar.png)

  - En esta ocasion primero creo el en el componente `ProfilePage` : `frontend/src/pages/ProfilePage.tsx`

    ```jsx
    import { useState } from 'react';
    import { useAuthStore } from '../store/useAuthStore';
    import { Camera, Mail, User } from 'lucide-react';

    const ProfilePage = () => {
      const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
      const [selectedImg, setSelectedImg] = useState<null | string>(null);

      const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        console.log(file);

        const reader = new FileReader();

        reader.readAsDataURL(file);

        reader.onload = async () => {
          const base64Image = reader.result as string;
          setSelectedImg(base64Image);
          await updateProfile({ profilePic: base64Image });
        };
      };

      return (
        <div className="h-screen pt-20">
          <div className="max-w-2xl mx-auto p-4 py-8">
            <div className="bg-base-300 rounded-xl p-6 space-y-8">
              <div className="text-center">
                <h1 className="text-2xl font-semibold ">Profile</h1>
                <p className="mt-2">Your profile information</p>
              </div>

              {/* avatar upload section */}

              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  <img
                    src={selectedImg || authUser?.profilePic || '/avatar.png'}
                    alt="Profile"
                    className="size-32 rounded-full object-cover border-4 "
                  />
                  <label
                    htmlFor="avatar-upload"
                    className={`
                      absolute bottom-0 right-0
                      bg-base-content hover:scale-105
                      p-2 rounded-full cursor-pointer
                      transition-all duration-200
                      ${isUpdatingProfile ? 'animate-pulse pointer-events-none' : ''}
                    `}
                  >
                    <Camera className="w-5 h-5 text-base-200" />
                    <input
                      type="file"
                      id="avatar-upload"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={isUpdatingProfile}
                    />
                  </label>
                </div>
                <p className="text-sm text-zinc-400">
                  {isUpdatingProfile ? 'Uploading...' : 'Click the camera icon to update your photo'}
                </p>
              </div>

              <div className="space-y-6">
                <div className="space-y-1.5">
                  <div className="text-sm text-zinc-400 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Full Name
                  </div>
                  <p className="px-4 py-2.5 bg-base-200 rounded-lg border">{authUser?.fullName}</p>
                </div>

                <div className="space-y-1.5">
                  <div className="text-sm text-zinc-400 flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email Address
                  </div>
                  <p className="px-4 py-2.5 bg-base-200 rounded-lg border">{authUser?.email}</p>
                </div>
              </div>

              <div className="mt-6 bg-base-300 rounded-xl p-6">
                <h2 className="text-lg font-medium  mb-4">Account Information</h2>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between py-2 border-b border-zinc-700">
                    <span>Member Since</span>
                    <span>{authUser?.createdAt?.split('T')[0]}</span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span>Account Status</span>
                    <span className="text-green-500">Active</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    };
    export default ProfilePage;


    ```

  hasta qui se podria poner un nuevo avatar en el perfil aun no se guardaria en la base de datos, ni en cloudary, pero si se podria ver en el perfil

  ![20avatarchange.png](images/20avatarchange.png)

  - despues creo el en el store, el estado updateProfile : `frontend/src/store/useAuthStore.ts`

    ```jsx

    updateProfile: async (data) => {
        set({ isUpdatingProfile: true });
        try {
          const res = await axiosInstance.put('/auth/update-profile', data);
          set({ authUser: res.data });
          toast.success('Profile updated successfully');
        } catch (error) {
          console.log('error in update profile:', error);
          // toast.error(error.response.data.message);
          // toast.error((error as Error).message);
          if (error instanceof Error && 'errors' in error) {
            console.log('Invalid data', error.message);
          } else {
            console.log('unknowlage error', error);
          }
        } finally {
          set({ isUpdatingProfile: false });
        }
      },
    ```

- # 10) ERROR PUT `Payload Too Large`

  - ![21errorpayload](images/21errorpayload.png)

  ```console
    http://localhost:5001/api/auth/update-profile
    Estado
    413
    Payload Too Large
  ```

  - ## El error 413 Payload Too Large:

    ocurre cuando el tamaño de la solicitud (en este caso, la imagen que estás enviando) excede el límite configurado en tu servidor. Esto sucede generalmente cuando el archivo que estás intentando enviar es demasiado grande para el servidor, ya sea que se esté enviando como un archivo en bruto o como una cadena Base64.

  - **SOLUCION**:Aumentar el límite de carga en tu servidor (Node.js/Express)
  - ir al backend: `backend/src/index.js`
    aumentarle

  ```js
  app.use(express.json({ limit: '50mb' }));
  ```

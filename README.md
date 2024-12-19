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

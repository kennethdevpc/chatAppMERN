# Guía: Uso del Objeto `req` en Express

El objeto `req` (abreviatura de **request**) en Express representa la solicitud HTTP que el cliente envía al servidor. A continuación, se detalla su uso, las propiedades más comunes y ejemplos prácticos.

---

## 1. ¿Qué es `req`?

`req` es un objeto que Express pasa automáticamente a cada middleware y controlador. Se utiliza para:

- **Acceder a los datos** enviados por el cliente (cuerpo, encabezados, cookies, etc.).
- **Modificar el objeto** para añadir propiedades que se usarán posteriormente (como `req.user`).

---

## 2. Propiedades comunes de `req`

### a) Datos de la solicitud

1. **`req.body`**: Contiene los datos enviados en el cuerpo de la solicitud (normalmente en solicitudes `POST` o `PUT`).
   ```javascript
   app.use(express.json()); // Necesario para procesar JSON en req.body
   app.post('/example', (req, res) => {
     console.log(req.body); // Muestra los datos enviados
   });
   ```
2. req.query: Contiene los parámetros de consulta (query string) en la URL.
   ```javascript
   // URL: /example?name=John&age=30
   app.get('/example', (req, res) => {
     console.log(req.query.name); // "John"
     console.log(req.query.age); // "30"
   });
   ```
3. req.params: Contiene los parámetros dinámicos definidos en la ruta.

```js
app.get('/users/:id', (req, res) => {
  console.log(req.params.id); // Valor del ID en la URL
});
```

4. req.cookies: Contiene las cookies enviadas por el cliente.

```javascript
const cookieParser = require('cookie-parser');
app.use(cookieParser());
app.get('/example', (req, res) => {
  console.log(req.cookies); // Muestra las cookies
});
```

### b) Información de la solicitud

1. req.method: El método HTTP de la solicitud (GET, POST, PUT, etc.).

```javascript
Copiar código
app.use((req, res, next) => {
  console.log(req.method); // "GET", "POST", etc.
  next();
});
```

2. req.url: La URL de la solicitud.

```javascript
Copiar código
app.use((req, res, next) => {
  console.log(req.url); // "/example"
  next();
});
```

3. req.headers: Contiene los encabezados de la solicitud.

```javascript
Copiar código
app.use((req, res, next) => {
  console.log(req.headers['user-agent']); // Información del navegador
  next();
});
```

4. req.ip: La dirección IP del cliente.

```javascript
Copiar código
app.get('/example', (req, res) => {
  console.log(req.ip); // Dirección IP del cliente
});
```

## c) Autenticación y personalización

Puedes añadir tus propias propiedades a req para pasar información entre middlewares:

```javascript
Copiar código
app.use((req, res, next) => {
  req.customProperty = 'Hello, World!';
  next();
});

app.get('/example', (req, res) => {
  console.log(req.customProperty); // "Hello, World!"
});
```

3. ¿Qué más puedo hacer con req?

### a) Añadir datos personalizados

En middlewares puedes modificar req para añadir datos específicos como:

req.user: Información del usuario autenticado.
req.startTime: Hora de inicio de la solicitud.

### b) Validar o filtrar información

Puedes usar req para validar datos o restringir accesos:

javascript
Copiar código
app.use((req, res, next) => {
if (!req.headers.authorization) {
return res.status(401).json({ message: 'Unauthorized' });
}
next();
});

### c) Interacciones avanzadas

Leer cookies.
Detectar agentes de usuario (navegador, móvil, etc.).
Registrar tiempos de ejecución o depurar.

### ejemplo completo:

```js
const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();

app.use(express.json()); // Procesar JSON
app.use(cookieParser()); // Procesar cookies

// Middleware personalizado
app.use((req, res, next) => {
  req.startTime = Date.now(); // Registrar tiempo de inicio
  next();
});

// Ruta ejemplo
app.get('/example/:id', (req, res) => {
  console.log('Método:', req.method); // "GET"
  console.log('URL:', req.url); // "/example/:id"
  console.log('Headers:', req.headers); // Encabezados HTTP
  console.log('Cookies:', req.cookies); // Cookies
  console.log('Query:', req.query); // Parámetros query string
  console.log('Params:', req.params); // Parámetros dinámicos
  console.log('Tiempo de inicio:', req.startTime); // Propiedad personalizada
  res.send('Revisa la consola para los detalles!');
});

app.listen(3000, () => {
  console.log('Servidor ejecutándose en http://localhost:3000');
});
```

# teoria mongodb:

- 1. Conceptos Básicos de MongoDB:

  - Ejemplo:
    Crear una base de datos y colección desde MongoDB Shell:

    ```javascript
      use myDatabase; // Cambia o crea una base de datos llamada "myDatabase"
      db.createCollection("users"); // Crea una colección llamada "users"
    ```

  - 2. Operaciones CRUD

    - Crear (Create):

    ```javascript
    db.users.insertOne({ name: 'John Doe', age: 30, hobbies: ['reading', 'gaming'] });
    db.users.insertMany([
      { name: 'Jane Smith', age: 25, hobbies: ['dancing'] },
      { name: 'Alice Johnson', age: 35, hobbies: ['running', 'coding'] },
    ]);
    ```

    - Leer (Read):

      - find() para consultas básicas.
      - Operadores de comparación `($eq, $ne, $gt, $lt, $gte, $lte).`
      - Operadores lógicos `($or, $and, $not).`
      - Proyección para seleccionar campos específicos.

      ```javascript
      // Encuentra todos los documentos
      db.users.find();
      // Encuentra documentos con condiciones
      db.users.find({ age: { $gt: 28 } }); // Usuarios mayores de 28 años
      db.users.find({ name: 'John Doe' }, { hobbies: 1, _id: 0 }); // Proyecta solo los hobbies
      ```

    - Actualizar (Update):
      updateOne() y updateMany().
      Operadores de actualización `($set, $unset, $inc, $rename).`

      - Actualizar (Update):

        ```javascript
        // Actualiza un solo documento
        db.users.updateOne({ name: 'John Doe' }, { $set: { age: 31 } });

        // Incrementa la edad de todos los usuarios
        db.users.updateMany({}, { $inc: { age: 1 } });
        ```

      - Eliminar (Delete):
        deleteOne()
        deleteMany()

        ```javascript
        Copiar código
        // Elimina un usuario específico
        db.users.deleteOne({ name: "Jane Smith" });

        // Elimina todos los usuarios mayores de 40
        db.users.deleteMany({ age: { $gt: 40 } });
        ```

    - Filtrado de Datos

      - Operadores de comparación: `$in, $nin.`
      - Consultas avanzadas con combinaciones de operadores.
      - Filtrar documentos anidados (uso de `dot notation`).
        - Ejemplo:

      ```javascript
      // Usuarios con edad entre 25 y 35
      db.users.find({ age: { $gte: 25, $lte: 35 } });
      // Usuarios con nombre "John" o "Alice"
      db.users.find({ name: { $in: ['John Doe', 'Alice Johnson'] } });
      ```

  - Índices y Performance

    - Creación de índices (createIndex()).
    - Índices compuestos y únicos.
    - Análisis de consultas (explain()).

      ```js
      // Crear un índice en el campo "name"
      db.users.createIndex({ name: 1 });

      // Verificar índices
      db.users.getIndexes();
      ```

  - Agregaciones (Aggregation Framework)

    - Pipeline de agregación:
      - $match para filtrar documentos.
      - $group para agrupar datos.
      - $project para transformar documentos.
      - $sort, $limit, $skip para manipular resultados.
      - $lookup para hacer joins entre colecciones.
      - $unwind para descomponer arrays.

    ```js
    db.users.aggregate([
      { $match: { age: { $gte: 30 } } }, // Filtrar usuarios con edad >= 30
      { $group: { _id: '$age', count: { $sum: 1 } } }, // Agrupar por edad
      { $sort: { count: -1 } }, // Ordenar por cantidad descendente
    ]);
    ```

  - Manipulación de Arrays

    ```js
    // Usuarios que tienen "reading" en hobbies
    db.users.find({ hobbies: 'reading' });

    // Actualiza arrays
    db.users.updateOne({ name: 'John Doe' }, { $push: { hobbies: 'traveling' } });
    ```

  - Modelado de Datos
    Ejemplo:

    - Relación embebida:

    ```js
    db.orders.insertOne({
      orderId: 1,
      user: { name: 'John Doe', email: 'john@example.com' },
      items: [{ product: 'Book', price: 15 }],
    });
    ```

    - Relación referenciada:

    ```javascript
    Copiar código
    db.users.insertOne({ _id: ObjectId("123"), name: "John Doe" });
    db.orders.insertOne({ orderId: 1, userId: ObjectId("123"), items: [{ product: "Book", price: 15 }] });
    ```

- 2. Usando la Biblioteca Nativa de MongoDB (mongodb)
     Esta es la biblioteca oficial que interactúa directamente con MongoDB. Aquí tú mismo gestionas todas las operaciones (e.g., conexión, creación de documentos, consultas) sin un nivel adicional de abstracción.

  - Ejemplo básico con mongodb:

  ```js
  const { MongoClient } = require('mongodb');

  const uri = 'your_mongo_connection_string';
  const client = new MongoClient(uri);

  const run = async () => {
    try {
      await client.connect(); // Conectar al servidor
      console.log('Connected to MongoDB');

      const db = client.db('test'); // Seleccionar la base de datos
      const usersCollection = db.collection('users'); // Seleccionar la colección

      // Insertar un documento
      const result = await usersCollection.insertOne({ name: 'John', age: 30 });
      console.log('Inserted document:', result.insertedId);

      // Leer documentos
      const users = await usersCollection.find().toArray();
      console.log('Users:', users);

      // Actualizar un documento
      await usersCollection.updateOne({ name: 'John' }, { $set: { age: 31 } });
      console.log('Document updated');

      // Eliminar un documento
      await usersCollection.deleteOne({ name: 'John' });
      console.log('Document deleted');
    } catch (error) {
      console.error('Error:', error);
    } finally {
      await client.close(); // Cerrar la conexión
    }
  };

  run();
  ```

- 3. Usando ORM, Mongoose
     Mongoose es una capa de abstracción sobre la biblioteca nativa de MongoDB. Simplifica la interacción al agregar:

     Modelos y esquemas para estructurar tus datos.
     Métodos para trabajar con la base de datos usando estos modelos.
     Ejemplo básico con Mongoose:

  ```js
  import mongoose from 'mongoose';

  const connectDB = async () => {
    try {
      await mongoose.connect('your_mongo_connection_string');
      console.log('Connected to MongoDB');
    } catch (error) {
      console.error('Connection error:', error);
    }
  };

  // Crear un esquema y modelo
  const userSchema = new mongoose.Schema({
    name: String,
    age: Number,
  });
  const User = mongoose.model('User', userSchema);

  const run = async () => {
    try {
      await connectDB();

      // Insertar un documento
      const user = new User({ name: 'John', age: 30 });
      await user.save();
      console.log('Inserted document:', user);

      // Leer documentos
      const users = await User.find();
      console.log('Users:', users);

      // Actualizar un documento
      await User.updateOne({ name: 'John' }, { $set: { age: 31 } });
      console.log('Document updated');

      // Eliminar un documento
      await User.deleteOne({ name: 'John' });
      console.log('Document deleted');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  run();
  ```

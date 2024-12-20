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

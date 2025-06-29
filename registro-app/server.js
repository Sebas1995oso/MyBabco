const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;

// Middleware para leer JSON
app.use(bodyParser.json());

// 👉 Servir archivos estáticos desde el directorio padre
app.use(express.static(path.join(__dirname, '..')));

// 👉 Ruta raíz para servir el index.html que está FUERA de la carpeta
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'index.html'));
});

// Conexión a la base de datos
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root', // tu contraseña si aplica
  database: 'registroUsuarios'
});

db.connect(err => {
  if (err) throw err;
  console.log('✅ Conectado a MySQL');
});

// Ruta para registrar usuario
app.post('/register', (req, res) => {
  const {
    name,
    propertyManager,
    email,
    phone,
   
  } = req.body;

  

  const sql = `INSERT INTO usuarios (full_name, property_manager, email, phone)
               VALUES (?, ?, ?, ?)`;

  const values = [name, propertyManager, email, phone];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('❌ Error al insertar:', err);
      return res.status(500).json({ message: 'Error al guardar en la base de datos' });
    }
    res.status(200).json({ message: 'Usuario registrado con éxito' });
  });
});

// Iniciar servidor
app.listen(port, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${port}`);
});


app.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password required' });
  }

  const sql = 'SELECT * FROM usuarios WHERE username = ? AND password = ?';
  db.query(sql, [username, password], (err, results) => {
    if (err) {
      console.error('❌ Error en login:', err);
      return res.status(500).json({ message: 'Error interno en el servidor' });
    }

    if (results.length > 0) {
      return res.status(200).json({ message: 'Login successful' });
    } else {
      return res.status(401).json({ message: 'Invalid username or password' });
    }
  });
});


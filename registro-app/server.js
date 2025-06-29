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
    username,
    password,
    confirmPassword
  } = req.body;

  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Las contraseñas no coinciden' });
  }

  const sql = `INSERT INTO usuarios (full_name, property_manager, email, phone, username, password)
               VALUES (?, ?, ?, ?, ?, ?)`;

  const values = [name, propertyManager, email, phone, username, password];

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

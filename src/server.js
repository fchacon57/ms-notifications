require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sendNotification } = require('./controllers/notificationController');

const app = express();
const PORT = process.env.PORT || 5001; // Usamos el 5001 para no chocar con el Backend Principal (5000)

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.status(200).send('Microservicio OK');
});

// Ruta única para recibir notificaciones
app.post('/api/notify', sendNotification);

app.listen(PORT, () => {
  console.log(`🚀 Microservicio de Notificaciones corriendo en http://localhost:${PORT}`);
});

// Es vital añadir '0.0.0.0' para que Render pueda redirigir el tráfico
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Microservicio de Notificaciones corriendo en puerto ${PORT}`);
});
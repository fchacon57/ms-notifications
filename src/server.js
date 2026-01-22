require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sendNotification } = require('./controllers/notificationController');

const app = express();
// Render asigna un puerto dinámico, por eso process.env.PORT es prioridad
const PORT = process.env.PORT || 5001; 

app.use(cors());
app.use(express.json());

// Ruta de salud (Vital para que Render no marque el servicio como caído)
app.get('/', (req, res) => {
    res.status(200).send('Microservicio OK');
});

// Ruta para recibir notificaciones
app.post('/api/notify', sendNotification);

// UN SOLO app.listen: Configuramos '0.0.0.0' para que sea visible en la nube
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Microservicio de Notificaciones corriendo en puerto ${PORT}`);
    console.log(`📢 Entorno: ${process.env.NODE_ENV || 'desarrollo'}`);
});
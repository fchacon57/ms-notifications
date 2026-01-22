const axios = require('axios');
const { BREVO_API_URL, BREVO_API_KEY } = require('../config/mailer');
const { contactEmailTemplate } = require('../templates/emailTemplate');
const { customerWelcomeTemplate } = require('../templates/customerTemplate');

const sendNotification = async (req, res) => {
    const contactData = req.body;

    if (!contactData || !contactData.email) {
        return res.status(400).json({ success: false, error: "Datos insuficientes" });
    }

    try {
        // Configuración común para Axios
        const axiosConfig = {
            headers: {
                'api-key': BREVO_API_KEY,
                'Content-Type': 'application/json'
            }
        };

        // Función para armar el cuerpo del correo según la API de Brevo
        const crearPayload = (toEmail, subject, html) => ({
            sender: { name: "Visual Core Digital", email: "visualcoredigital@gmail.com" },
            to: [{ email: toEmail }],
            subject: subject,
            htmlContent: html
        });

        // Enviamos los dos correos en paralelo usando Axios
        await Promise.all([
            axios.post(BREVO_API_URL, crearPayload(
                process.env.EMAIL_ADMIN || 'visualcoredigital@gmail.com',
                `Nuevo Lead: ${contactData.nombre}`,
                contactEmailTemplate(contactData)
            ), axiosConfig),
            
            axios.post(BREVO_API_URL, crearPayload(
                contactData.email,
                'Confirmación de contacto - Visual Core Digital',
                customerWelcomeTemplate(contactData.nombre)
            ), axiosConfig)
        ]);

        console.log('✅ Correos enviados con éxito vía API REST (Brevo)');
        return res.status(200).json({ success: true, message: "Notificaciones enviadas" });

    } catch (error) {
        // Log detallado para saber qué dice Brevo si falla
        const errorMsg = error.response ? JSON.stringify(error.response.data) : error.message;
        console.error('❌ Error en el envío:', errorMsg);
        
        return res.status(500).json({ 
            success: false, 
            error: "Fallo en el servicio de correo",
            details: errorMsg
        });
    }
};

module.exports = { sendNotification };
const { transporter } = require('../config/mailer');
const { contactEmailTemplate } = require('../templates/emailTemplate');
const { customerWelcomeTemplate } = require('../templates/customerTemplate');

/**
 * Controlador que procesa la petición del Backend Principal
 * y dispara los correos en paralelo.
 */
const sendNotification = async (req, res) => {
    const contactData = req.body;

    // Validación básica de que recibimos datos
    if (!contactData || !contactData.email) {
        return res.status(400).json({ 
            success: false, 
            error: "Datos de contacto insuficientes" 
        });
    }

    try {
        // --- PREPARACIÓN: Correo Interno (Para ti) ---
        const adminMailOptions = {
            from: `"Visual Core Digital" <${process.env.EMAIL_USER}>`,
            to: process.env.EMAIL_ADMIN || 'visualcoredigital@gmail.com',
            subject: `Nuevo Lead: ${contactData.nombre}`,
            html: contactEmailTemplate(contactData)
        };

        // --- PREPARACIÓN: Correo Cliente (Agradecimiento) ---
        const customerMailOptions = {
            from: `"Visual Core Digital" <${process.env.EMAIL_USER}>`,
            to: contactData.email,
            replyTo: 'visualcoredigital@gmail.com',
            subject: 'Confirmación de contacto - Visual Core Digital',
            html: customerWelcomeTemplate(contactData.nombre),
            priority: 'high' 
        };

        // --- EJECUCIÓN: Envío en Paralelo (Tu lógica original optimizada) ---
        const [infoAdmin, infoCustomer] = await Promise.all([
            transporter.sendMail(adminMailOptions),
            transporter.sendMail(customerMailOptions)
        ]);

        console.log('✅ Notificación interna enviada:', infoAdmin.messageId);
        console.log('✅ Agradecimiento enviado al cliente:', infoCustomer.messageId);

        return res.status(200).json({ 
            success: true, 
            message: "Notificaciones enviadas con éxito",
            ids: { admin: infoAdmin.messageId, customer: infoCustomer.messageId }
        });

    } catch (error) {
        console.error('❌ Error crítico en el Microservicio:', error.message);
        return res.status(500).json({ 
            success: false, 
            error: "Fallo al procesar los envíos de correo",
            details: error.message 
        });
    }
};

module.exports = { sendNotification };
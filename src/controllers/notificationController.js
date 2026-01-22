const { apiInstance, SibApiV3Sdk } = require('../config/mailer'); // Cambio aquí
const { contactEmailTemplate } = require('../templates/emailTemplate');
const { customerWelcomeTemplate } = require('../templates/customerTemplate');

const sendNotification = async (req, res) => {
    const contactData = req.body;

    if (!contactData || !contactData.email) {
        return res.status(400).json({ success: false, error: "Datos insuficientes" });
    }

    try {
        const prepararEmail = (destinatario, asunto, contenido) => {
            // Cambio en la forma de instanciar el objeto de email
            let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail(); 
            
            sendSmtpEmail.subject = asunto;
            sendSmtpEmail.htmlContent = contenido;
            sendSmtpEmail.sender = { "name": "Visual Core Digital", "email": "visualcoredigital@gmail.com" };
            sendSmtpEmail.to = [{ "email": destinatario }];
            return sendSmtpEmail;
        };

        const emailAdmin = prepararEmail(
            process.env.EMAIL_ADMIN || 'visualcoredigital@gmail.com',
            `Nuevo Lead: ${contactData.nombre}`,
            contactEmailTemplate(contactData)
        );

        const emailCliente = prepararEmail(
            contactData.email,
            'Confirmación de contacto - Visual Core Digital',
            customerWelcomeTemplate(contactData.nombre)
        );

        // Envío
        await Promise.all([
            apiInstance.sendTransacEmail(emailAdmin),
            apiInstance.sendTransacEmail(emailCliente)
        ]);

        console.log('✅ Correos enviados con éxito vía Brevo');
        return res.status(200).json({ success: true, message: "Notificaciones enviadas" });

    } catch (error) {
        console.error('❌ Error en el envío de Brevo:', error.message);
        return res.status(500).json({ success: false, error: error.message });
    }
};

module.exports = { sendNotification };
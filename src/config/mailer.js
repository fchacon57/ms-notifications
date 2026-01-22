// Ya no necesitamos importar la librería de Brevo que falla
module.exports = {
    BREVO_API_URL: 'https://api.brevo.com/v3/smtp/email',
    BREVO_API_KEY: process.env.BREVO_API_KEY
};
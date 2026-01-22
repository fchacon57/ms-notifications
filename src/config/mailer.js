const SibApiV3Sdk = require('@getbrevo/brevo');

// Configuramos la autenticación de forma directa
const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

// Configuramos la API Key
const client = SibApiV3Sdk.ApiClient.instance;
const apiKey = client.authentications['api-key'];
apiKey.apiKey = process.env.BREVO_API_KEY;

// Exportamos solo lo que necesitamos
module.exports = { apiInstance, SibApiV3Sdk };
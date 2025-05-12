import dotenv from 'dotenv';

dotenv.config();

const mode = process.argv[2] || 'prod';

const config = {
    port: process.env.PORT || 8080,
    secret_key: process.env.SECRET_KEY,
    jwt_secret: process.env.JWT_SECRET,
    github_client_id: process.env.GITHUB_CLIENT_ID,
    github_client_secret: process.env.GITHUB_CLIENT_SECRET,
    mongo_uri: process.env.MONGO_URI,
    persistence: process.env.PERSISTENCE,
    mail_user: process.env.MAIL_USER,
    mail_pass: process.env.MAIL_PASS,
    twilio_sid: process.env.TWILIO_SID,
    twilio_token: process.env.TWILIO_TOKEN,
    whatsapp_dest: process.env.WHATSAPP_DEST
};

export default config;

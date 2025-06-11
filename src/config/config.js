import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const env = process.env.NODE_ENV || 'dev';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let envPath;

if (env === 'test') {
    envPath = path.resolve(__dirname, '../../.env.test');
} else if (env === 'prod') {
    envPath = path.resolve(__dirname, '../../.env.prod');
} else {
    envPath = path.resolve(__dirname, '../../.env');
}

dotenv.config({ path: envPath });

const config = {
    port: process.env.PORT || 8080,
    mode: env,
    secret_key: process.env.SECRET_KEY,
    jwt_secret: process.env.JWT_SECRET,
    github_client_id: process.env.GITHUB_CLIENT_ID,
    github_client_secret: process.env.GITHUB_CLIENT_SECRET,
    mongo_uri: env === 'test' ? process.env.MONGO_TEST_URI : process.env.MONGO_URI,
    persistence: process.env.PERSISTENCE,
    mail_user: process.env.MAIL_USER,
    mail_pass: process.env.MAIL_PASS,
    twilio_sid: process.env.TWILIO_SID,
    twilio_token: process.env.TWILIO_TOKEN,
    whatsapp_dest: process.env.WHATSAPP_DEST || 'whatsapp:+541111111111',
};

export default config;

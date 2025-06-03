import dotenv from 'dotenv';
import path from 'path'
import { fileURLToPath } from 'url'

const isTestEnv = process.env.NODE_ENV === 'test'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const envPath = isTestEnv ? path.resolve(__dirname, '../../.env.test') : path.resolve(__dirname, '../../.env')

dotenv.config({ path: envPath })

console.log('Cargando config.js - NODE_ENV:', process.env.NODE_ENV)
console.log('MONGO_URI elegida:', process.env.MONGO_URI)



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
    whatsapp_dest: process.env.WHATSAPP_DEST,
    mode: process.env.NODE_ENV || 'dev'
};

export default config;

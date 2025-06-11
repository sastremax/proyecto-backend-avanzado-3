import twilio from 'twilio';
import config from '../config/config.js';
import { logger } from '../config/logger.environment.js'

let client = null;

if (config.twilio_sid && config.twilio_token) {
    client = twilio(config.twilio_sid, config.twilio_token);
    logger.info('Twilio client initialized.');
} else {
    logger.warn('Twilio client NOT initialized: SID or TOKEN missing.');
}

export const sendWhatsAppMessage = async (to, message) => {

    if (!client) {
        logger.warn(`Skipping WhatsApp message to ${to}: Twilio client not initialized.`);
        return;
    }
    
    try {
        await client.messages.create({
            from: 'whatsapp:+14155238886',
            to: to,
            body: message
        });
        logger.info(`WhatsApp message sent to ${to}`);
    } catch (error) {
        logger.error(`WhatsApp message failed to ${to}: ${error.message}`);
        throw new Error(`Failed to send WhatsApp message: ${error.message}`);
    }

};
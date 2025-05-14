import twilio from 'twilio';
import config from '../config/config.js';
import { logger } from '../config/loggerEnvironment.js'

const client = twilio(config.twilio_sid, config.twilio_token);

export const sendWhatsAppMessage = async (to, message) => {

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
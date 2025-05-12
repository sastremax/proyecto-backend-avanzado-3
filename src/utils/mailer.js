import nodemailer from 'nodemailer';
import config from '../config/config.js';

export const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: config.mail_user,
        pass: config.mail_pass
    },
    tls: {
        rejectUnauthorized: false
    }
});

export const sendRecoveryEmail = async (to, token) => {

    const resetLink = `http://localhost:8080/api/sessions/reset-password?token=${token}`;
    const mailOptions = {
        from: config.mail_user,
        to,
        subject: 'Recuperación de contraseña - Arcoiris Equipotcc',
        html: `
            <p>Hola,</p>
            <p>Recibimos una solicitud para restablecer tu contraseña. Si no fuiste vos, podés ignorar este mensaje.</p>
            <p>Para crear una nueva contraseña, hacé clic en el siguiente enlace (válido por 1 hora):</p>
            <p><a href="${resetLink}">Restablecer contraseña</a></p>
            <p>Gracias,<br>El equipo de Arcoiris Equipotcc</p>
        `
    };

    await transporter.sendMail(mailOptions);

};
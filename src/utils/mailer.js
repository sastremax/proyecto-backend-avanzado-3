import nodemailer from 'nodemailer';
import config from '../config/config.js';
import { createHash, isValidPassword } from '../utils/bcrypt.js'

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

export const resetPassword = async (req, res) => {

    try {
        const { token } = req.query
        const { newPassword } = req.body

        if (!token || !newPassword) {
            return res.badRequest('Token and new password are required.')
        }

        const decoded = jwt.verify(token, config.jwt_secret)
        const user = await userService.getByEmail(decoded.email)

        if (!user) return res.notFound('User not found.')

        const passwordAlreadyUsed = isValidPassword(user, newPassword)
        if (passwordAlreadyUsed) return res.badRequest('Cannot use the same password.')

        const newHashedPassword = createHash(newPassword)

        await UserModel.findOneAndUpdate({ email: user.email }, { password: newHashedPassword })

        return res.success('Password reset successfully.')
    } catch (error) {
        return res.internalError('Invalid or expired token.', error)
    }

}
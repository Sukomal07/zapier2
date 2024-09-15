/* eslint-disable turbo/no-undeclared-env-vars */
import nodemailer from 'nodemailer';
interface MailOption {
    toMail: string
    subject: string
    message: string
}

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export const sendMail = async ({ toMail, subject, message }: MailOption) => {

    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: toMail,
        subject: subject,
        html: message
    })
}


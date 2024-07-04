import nodemailer from "nodemailer";

// Create a reusable transporter object using the default SMTP transport
const transport = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD,
    },
    tls: {
        rejectUnauthorized: false
    },
    connectionTimeout: 5 * 60 * 1000, 
    socketTimeout: 5 * 60 * 1000,
    debug: true, 
    logger: true 
});

// Function to send an email
export const sendEmail = async (dto) => {
    const { sender, recipients, subject, message,data } = dto;

    const htmlMessage =data.htmlMessage;

    return await transport.sendMail({
        from: `${sender.name} <${sender.address}>`,
        to: recipients.map(recipient => `${recipient.name} <${recipient.address}>`).join(", "),
        subject,
        html: htmlMessage,
        text: message // Fallback to plain text if HTML is not supported
    });
};
const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    try {
        // Create a basic transporter using SMTP settings
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            secure: process.env.EMAIL_PORT == 465, // true for port 465, false for other ports (587)
            auth: {
                user: process.env.EMAIL_USER, // e.g., info@gaurykart.shop
                pass: process.env.EMAIL_PASS, // App password
            },
        });

        // Define options for the email
        const mailOptions = {
            from: `GauryKart Support <${process.env.EMAIL_USER}>`,
            to: options.email,
            subject: options.subject,
            html: options.message,
        };

        // Send the email
        const info = await transporter.sendMail(mailOptions);
        console.log(`Email sent: ${info.messageId}`);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

module.exports = sendEmail;

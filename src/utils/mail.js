// nodemailer -> transporter
// mailtrap -> email testing (to avoid gmail clutter);
// mailgen -> addon (beautify);
import nodemailer from "nodemailer"
import Mailgen from "mailgen";

// mailgen stuffs

// Configure mailgen by setting a theme and your product info
const mailGenerator = new Mailgen({
    theme: 'default',
    product: {
        // Appears in header & footer of e-mails
        name: 'none',
        link: 'https://aadarshbanjade.com.np'
        // Optional product logo
        // logo: 'https://mailgen.js/img/logo.png'
    }
});

const email = {
    body: {
        name: 'someone',
        intro: 'Welcome to nothing! We\'re very excited to have you on board.',
        action: {
            instructions: 'To get started with Mailgen, please click here:',
            button: {
                color: '#22BC66', // Optional action button color
                text: 'Confirm your account',
                link: `localhost/api/v1/users/verify/${token}`
            }
        },
        outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.'
    }
};

// Generate an HTML email with the provided contents
const emailBody = mailGenerator.generate(email);

// Generate the plaintext version of the e-mail (for clients that do not support HTML)
const emailText = mailGenerator.generatePlaintext(email);


// nodemailer and mail trap stuffs
const transporter = nodemailer.createTransport({
    host: process.env.MAIL_SMTP_HOST,
    port: process.env.MAIL_SMTP_PORT,
    secure: false, // true for port 465, false for other ports
    auth: {
        user: process.env.MAIL_SMTP_USER,
        pass: process.env.MAIL_SMTP_PASS
    },
});

async function sendMail() {
    // send mail with defined transport object
    const info = await transporter.sendMail({
        from: 'none', // sender address
        to: user.email,
        subject: "Reset your password",
        text: emailText,
        html: emailBody
    });

    console.log("Message sent: %s", info.messageId);
    // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
}


sendMail().catch(console.error); // error

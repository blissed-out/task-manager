import nodemailer from "nodemailer";
import Mailgen from "mailgen";

const sendMail = async (options) => {
    const mailGenerator = new Mailgen({
        theme: "default",

        product: {
            // Appears in header & footer of e-mails
            name: "none",
            link: "https://aadarshbanjade.com.np",
            // Optional product logo
            // logo: 'https://mailgen.js/img/logo.png'
        },
    });

    const emailBody = mailGenerator.generate(options.mailgenContent);

    const emailText = mailGenerator.generatePlaintext(options.mailgenContent);

    const transporter = nodemailer.createTransport({
        host: process.env.MAIL_SMTP_HOST,
        port: process.env.MAIL_SMTP_PORT,
        secure: false, // true for port 465, false for other ports
        auth: {
            user: process.env.MAIL_SMTP_USER,
            pass: process.env.MAIL_SMTP_PASS,
        },
    });

    // since it's not critical to business logic, we will throw silent error instead of breaking incase it fails
    try {
        const info = await transporter.sendMail({
            from: "none@blissful.com",
            to: options.userEmail,
            subject: "Reset your password",
            text: emailText,
            html: emailBody,
        });
        console.log("Message sent: %s", info.messageId);
    } catch (error) {
        console.error(
            "Email send failed silently. May be host is not setup in env?",
        );
        console.error("Error", error);
    }
};

const emailVerificationContent = (userEmail, verificationUrl) => {
    return {
        body: {
            name: userEmail,
            intro: "Welcome to nothing! We're very excited to have you on board.",
            action: {
                instructions: "To get started with nothing, please click here:",
                button: {
                    color: "#22BC66", // Optional action button color
                    text: "Confirm your account",
                    link: `${verificationUrl}`,
                },
            },
            outro: "Need help, or have questions? Just reply to this email, we'd love to help.",
        },
    };
};

const forgetPasswordMailContent = (username, forgetPasswordUrl) => {
    return {
        body: {
            name: username,
            intro: "We got your request for forget password. ",
            action: {
                instruction: "Click the link below to set your new password: ",
                button: {
                    color: "#22BC66",
                    text: "Reset Password",
                    link: `${forgetPasswordUrl}`,
                },
            },
        },
    };
};

export { sendMail, emailVerificationContent, forgetPasswordMailContent };

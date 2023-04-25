const nodemailer = require('nodemailer');

const path = require('path');

const hbs = require('nodemailer-express-handlebars');

exports.emailSender = async (email, url) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.APP_PASSWORD,
        },
    });

    const handlebarOptions = {
        viewEngine: {
            extName: '.handlebars',
            partialsDir: path.resolve(__dirname, '../views/'),
            defaultLayout: false,
        },
        viewPath: path.resolve(__dirname, '../views/'),
        extName: '.handlebars',
    };

    transporter.use('compile', hbs(handlebarOptions));

    const info = {
        from: process.env.EMAIL,
        to: email,
        subject: 'Hello ✔',
        text: `Hello`,
        template: 'index',
        context: {
            url: url,
        },
    };

    transporter.sendMail(info);
};

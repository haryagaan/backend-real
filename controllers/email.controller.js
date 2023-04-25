const { User } = require('../models/user.module');

const jwt = require('jsonwebtoken');

const { emailSender } = require('../email/emailSender');

exports.emailConfirmation = async (req, res) => {
    const token = req.params.token;

    if (!token) {
        return res.status(400).send('Token required');
    }

    try {
        const id = jwt.verify(token, process.env.TOKEN_SECRET, (error, item) => {
            if (!error) {
                return item.id;
            } else {
                return res.status(400).send('Token invalid');
            }
        });

        const user = await User.findById(id);

        if (!user) {
            return res.status(404).send('Couldnt find user');
        }

        user.isVerified = true;

        await user.save();

        return res.redirect(process.env.BASE_URL_FRONTEND);
    } catch (err) {
        res.status(404).send(err);
    }
};

exports.sendUrl = async (req, res) => {
    const userId = req.params.id;

    const user = await User.findById(userId);

    if (!user) {
        res.status(404).send('Couldnt find user');
    }

    try {
        const token = jwt.sign({ id: userId }, process.env.TOKEN_SECRET, {
            expiresIn: '3m',
        });

        const url = process.env.BASE_URL_BACKEND + '/email/confirm/' + token;

        emailSender(user.email, url);

        res.status(200).send('New url sent to your email');
    } catch (err) {
        res.status(400).send(err);
    }
};

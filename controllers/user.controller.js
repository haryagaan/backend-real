const { User } = require('../models/user.module');
const bcrypt = require('bcrypt');

exports.getUsers = async (req, res) => {
    try {
        const data = await User.find({});
        console.log(data);
        res.send(data);
    } catch (err) {
        throw res.send(err);
    }
};

exports.getUser = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await User.findById(id, {
            password: 0,
        });
        res.send(user);
    } catch (err) {
        throw res.send(err);
    }
};

exports.createRole = async (req, res) => {
    const body = req.body || {};

    if (!body.firstName || !body.lastName || !body.email) return res.send('name, password, email is required');

    try {
        const user = await User.findOne({
            firstName: body.firstName,
            lastName: body.lastName,
            email: body.email,
        });

        if (!user) {
            return res.status(404).send('Couldnt find user');
        }

        const isValidPassword = await bcrypt.compare(body.password, user.password);

        if (!isValidPassword) {
            return res.status(400).send('Password incorrect');
        }

        Object.assign(user, body.role);

        await user.save();

        res.send('updated');
    } catch (err) {
        res.send(err);
    }
};

exports.updateUser = async (req, res) => {
    try {
        const data = req.body;
        const id = req.params.id;
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).send('Couldnt find user');
        }
        Object.assign(user, data);
        await user.save();
    } catch (err) {
        throw res.send(err);
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        return res.send("user deleted")
    } catch (err) {
        throw res.send("zaill");
    }
};

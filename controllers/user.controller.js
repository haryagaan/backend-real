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
    try {
        const body = req.body || {};

        if (!body.firstName || !body.lastName || !body.email) return res.send('name, password, email is required');

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

        const { role } = body;
        if (![200, 300, 999].includes(role.user)) {
            return res.status(400).send('Invalid role');
        }

        user.role = body.role;

        await user.save();

        res.json(user);
    } catch (error) {
        res.send(error);
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

        res.status(200).json(user)
    } catch (err) {
        throw res.send(err);
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            const user = req.body;
        }
        return res.send('user deleted');
        
    } catch (err) {
        throw res.send(err);
    }
};

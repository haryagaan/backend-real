const { Schema, Types, model } = require('mongoose');

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true,
        min: 2,
        max: 30,
    },

    lastName: {
        type: String,
        required: true,
        min: 2,
        max: 30,
    },

    email: {
        type: String,
        required: false,
        min: 2,
        max: 30,
    },

    password: {
        type: String,
        required: true,
        min: 6,
    },

    imageUrl: {
        type: String,
        default: 'https://api-private.atlassian.com/users/6b5c1609134a5887d7f3ab1b73557664/avatar',
    },

    isVerified: {
        type: Boolean,
        default: false,
    },

    role: {
        type: Object,
        default: { user: 200 },
        required: true,
        validate: {
            validator: function (role) {
                console.log(role);
                return role === undefined || role === null || role.user === 300 || role.user === 200;
            },
            message: 'Invalid role',
        },
    },

    rating: {
        type: Number,
        default: 0,
    },

    jobs: [{ type: Schema.Types.ObjectId, ref: 'Jobs' }],
});

exports.User = model('users', userSchema);

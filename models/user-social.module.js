const { Schema, Types, model } = require('mongoose');

const userSocialSchema = new Schema({
    firstName: {
        type: String,
        required: true,
    },

    lastName: {
        type: String,
        required: true,
    },

    email: {
        type: String,
        required: true,
    },

    imageUrl: {
        type: String,
        required: true,
    },

    socialType: {
        type: String,
        required: true,
    },

    socialUid: {
        type: String,
        required: true,
    },

    clientOrFreelancer: {
        type: Object,
        required: true,
    },

    role: {
        type: Object,
        default: { User: 200 },
    },

    rating: {
        type: Number,
        default: 0,
    },

    jobs: [{ type: Schema.Types.ObjectId, ref: 'Jobs' }],
});

exports.UserSocial = model('users-socials', userSocialSchema);

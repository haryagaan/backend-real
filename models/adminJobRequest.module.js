const { Schema, Types, model } = require('mongoose');

const adminJobRequestSchema = new Schema({
    jobName: {
        type: String,
        required: true,
    },

    category: {
        type: Schema.Types.ObjectId,
        ref: 'jobs-categories',
        required: true,
    },

    createdAt: {
        type: Date,
        default: new Date(),
    },

    creatorId: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: true,
    },

    creatorIdSocial: {
        type: Schema.Types.ObjectId,
        ref: 'users-socials',
        required: true,
    },

    creatorType: {
        type: String,
        required: true,
    },
});

exports.AdminJobRequest = model('admin-job-requests', adminJobRequestSchema);

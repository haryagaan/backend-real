const { Schema, Types, model } = require('mongoose');

const jobSchema = new Schema({
    name: {
        type: String,
        required: true,
    },

    category: {
        type: String,
        required: true,
    },

    totalUsers: {
        type: Number,
        default: 0,
    },
});

exports.Job = model('jobs', jobSchema);

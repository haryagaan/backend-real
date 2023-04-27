const { Schema, Types, model } = require('mongoose');

const jobSchema = new Schema({
    name: {
        type: String,
        required: true,
    },

    category: {
        type: Schema.Types.ObjectId,
        ref:"jobs-categories",
        required: true,
    },

    posts:[{
        type:Schema.Types.ObjectId,
        ref:"jobs-posts",
    }],

    totalUsers: {
        type: Number,
        default: 0,
    },
    
});

exports.Job = model('jobs', jobSchema);

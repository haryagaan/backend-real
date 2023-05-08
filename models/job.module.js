const { Schema, Types, model } = require('mongoose');

const jobSchema = new Schema({
    name: {
        type: String,
        required: true,
    },

    category: {
        type: Schema.Types.ObjectId,
        ref: 'jobs-categories',
        required: true,
    },

    imageUrl:{
        type:String,
        required:true
    },

    clientPosts: [
        {
            type: Schema.Types.ObjectId,
            ref: 'jobs-posts-client',
        },
    ],

    freelancerPosts:[
        {
            type: Schema.Types.ObjectId,
            ref: 'jobs-posts-freelancer',
        },
    ],

    totalUsers: {
        type: Number,
        default: 0,
    },
});

exports.Job = model('jobs', jobSchema);

const { Schema, Types, model } = require('mongoose');

const jobCategorySchema = new Schema({
    category: {
        type: String,
        required: true,
    },

    imageUrl:{
        type:String,
        required:true,
    },

    jobs: [{ type: Schema.Types.ObjectId, ref: 'jobs' }],

    totalJobs:{
        type:Number,
        default:0,
    }
});

exports.JobCategory = model('jobs-categories', jobCategorySchema);

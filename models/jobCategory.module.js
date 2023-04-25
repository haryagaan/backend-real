const { Schema, Types, model } = require('mongoose');

const jobCategorySchema = new Schema({
    category: {
        type: String,
        required: true,
    },

    jobs: [{ type: Schema.Types.ObjectId, ref: 'jobs' }],
});

exports.JobCategory = model('jobs-Categories', jobCategorySchema);

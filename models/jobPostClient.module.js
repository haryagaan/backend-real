const { Schema, Types, model } = require('mongoose');

const jobPostClientSchema = new Schema({
    title:{
        type:String,
        required:true,
    },

    mainText:{
        type:String,
        required:true
    },

    imageUrl:{
        type:String,
    },

    price:{
        type:Number,
        required:true,
    },

    jobId:{
        type:Schema.Types.ObjectId,
        ref:"jobs",
        required:true,
    },

    creatorId:{
        type:Schema.Types.ObjectId,
        ref :"users"
    },

    creatorSocialId:{
        type:Schema.Types.ObjectId,
        ref:"users-socials"
    },

});

exports.JobPostClient = model('jobs-posts-client', jobPostClientSchema);

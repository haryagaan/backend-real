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

    imageUrl:[{
        type:String,
    }],

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

    totalReacts:[{
        type:Schema.Types.ObjectId,
    }],

    likes:[{
        type:Schema.Types.ObjectId,
    }],

    dislikes:[{
        type:Schema.Types.ObjectId,
    }],

    comments:[{
        type:Schema.Types.ObjectId,
        ref:"comments",
    }]

});

exports.JobPostClient = model('jobs-posts-client', jobPostClientSchema);

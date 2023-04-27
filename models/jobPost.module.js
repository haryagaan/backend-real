const { Schema, Types, model } = require('mongoose');

const jobPostSchema = new Schema({
    //post texts

    title:{
        type:String,
        required:true,
    },

    mainText:{
        type:String,
        required:true,
        maxLength: 100,
    },

    price:{
        type:String,
        required:true,
    },

    //job,category

    job:{
        type:Schema.Types.ObjectId,
        ref:"jobs",
        required:true,
    },

    category:{
        type:Schema.Types.ObjectId,
        ref:"jobs-categories",
        required:true,
    },

    //about creators

    creatorId:{
        type:Schema.Types.ObjectId,
        ref:"users",
        required:true,
    },

    creatorIdSocial:{
        type:Schema.Types.ObjectId,
        ref:"users-socials",
        required:true,
    },

    creatorType:{
        type:String,
        required:true
    },

    creatorRating:{
        type:String,
        required:true,
    },
});

exports.JobPost = model('jobs-posts', jobPostSchema);

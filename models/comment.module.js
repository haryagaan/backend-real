const { Schema, Types, model } = require('mongoose');

const commentSchema = new Schema({
    creatorId:{
        type:Schema.Types.ObjectId,
        ref:"users",
        required:true,
    },

    creatorSocialId:{
        type:Schema.Types.ObjectId,
        ref:"users-socials",
        required:true,
    },

    text:{
        type:String,
        required:true,
    },

    createdAt:{
        type:String,
        default:new Date().toLocaleString(),
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

    replies:[{
        type:Schema.Types.ObjectId,
        ref:"comments",
    }]

});

exports.Comment = model('comments', commentSchema);

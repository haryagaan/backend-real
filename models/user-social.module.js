const { Schema, Types, model } = require('mongoose');

const userSocialSchema = new Schema({
    firstName: {
        type: String,
        required: true,
    },

    lastName: {
        type: String,
        required: true,
    },

    email: {
        type: String,
        required: true,
    },

    imageUrl: {
        type: String,
        required: true,
    },

    galleryUrls:[
        {
            type:String,
        }
    ],

    infoText:{
        type:String,
        default:"My info ..."
    },

    facebookInfo:{
        type:String,
        default:"*********"
    },

    instagramInfo:{
        type:String,
        default:"*********"
    },
    
    googleInfo:{
        type:String,
        default:"*********"
    },

    phoneInfo:{
        type:String,
        default:"*********"
    },

    socialType: {
        type: String,
        required: true,
    },

    socialUid: {
        type: String,
        required: true,
    },

    role: {
        type: Object,
        default: { user: 200 },
        required: true,
    },

    rating: {
        type: Number,
        default: 0,
    },

    ratingCount:{
        type:Number,
        default:0
    },

    jobs: [{ type: Schema.Types.ObjectId, ref: 'jobs' }],

    notifications: [
        {
            type: Object,
        },
    ],

    createdAt:{
        type:Date,
        default:new Date(),
    }
});

exports.UserSocial = model('users-socials', userSocialSchema);

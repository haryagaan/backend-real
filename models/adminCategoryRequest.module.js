const { Schema, Types, model } = require('mongoose');

const adminCategoryRequestSchema = new Schema({
   category:{
    type:String,
    required:true,
   },

   text:{
    type:String,
   },

    createdAt: {
        type: Date,
        default: new Date(),
    },

    creatorId: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: true,
    },

    creatorIdSocial: {
        type: Schema.Types.ObjectId,
        ref: 'users-socials',
        required: true,
    },

    creatorType: {
        type: String,
        required: true,
    },
});

exports.AdminCategoryRequest = model('admin-category-requests', adminCategoryRequestSchema);

const { AdminJobRequest } = require('../models/adminJobRequest.module');

const {AdminCategoryRequest}=require("../models/adminCategoryRequest.module")

const { User } = require('../models/user.module');

const { UserSocial } = require('../models/user-social.module');

const { JobCategory } = require('../models/jobCategory.module');

const jwt=require("jsonwebtoken");

exports.makeJobRequest = async (req, res) => {
    const { jobName , text } = req.body;

    const token = req.params.token;

    const category = req.params.category;

    let creatorType;

    try {
        if (!token || !jobName || !category) {
            return res.send('Failed');
        }

        const payload=jwt.verify(token , process.env.TOKEN_SECRET);

        const id=payload.user._id;

        const existingUser = await User.findById(id);

        const existingUserSocial = await UserSocial.findById(id);

        if (!existingUser && !existingUserSocial) {
            return res.send('No user exists');
        } else {
            if (existingUser) {
                creatorType = 'basic';
            } else {
                creatorType = 'social';
            }
        }

        const existingCategory = await JobCategory.findById(category);

        if (!existingCategory) {
            return res.send('Category not found');
        }

        const newReq = await AdminJobRequest.create({
            jobName,
            category,
            text,
            creatorType,
            creatorId: id,
            creatorIdSocial: id,
        });

        res.json(newReq);
    } catch (err) {
        res.send(err);
    }
};

exports.makeCategoryRequest=async(req,res)=>{
    const {category , text}=req.body;

    const token=req.params.token;

    if(!category || !token){
        return res.status(400).send("Failed");
    }

    const payload=jwt.verify(token , process.env.TOKEN_SECRET);

    const id=payload.user._id;

    const existingUser=await User.findById(id);

    const existingUserSocial=await UserSocial.findById(id);

    if(!existingUser && !existingUserSocial){
        return res.status(404).send("User not found");
    }

    let creatorType;

    try{

        if (existingUser) {
            creatorType = 'basic';
        } else if(existingUserSocial) {
            creatorType = 'social';
        }

        const newCategory=await AdminCategoryRequest.create({
            category,
            text,
            creatorId:id,
            creatorIdSocial:id,
            creatorType
        })

        res.status(200).json(newCategory)

    }catch(err){
        res.send(err);
    }
}

exports.getJobRequests = async (req, res) => {
    try {
        const allReq = await AdminJobRequest.find({}).populate('creatorId');

        const allReqSocial = await AdminJobRequest.find({}).populate('creatorIdSocial');

        const filtered = allReq.filter((req) => req.creatorId != null);

        const filteredSocial = allReqSocial.filter((req) => req.creatorIdSocial != null);

        res.json({ basicUsers: filtered, socialUsers: filteredSocial });
    } catch (err) {
        res.send(err);
    }
};

exports.getCategoryRequests = async (req, res) => {
    try {
        const allReq = await AdminCategoryRequest.find({}).populate('creatorId');

        const allReqSocial = await AdminCategoryRequest.find({}).populate('creatorIdSocial');

        const filtered = allReq.filter((req) => req.creatorId != null);

        const filteredSocial = allReqSocial.filter((req) => req.creatorIdSocial != null);

        res.json({ basicUsers: filtered, socialUsers: filteredSocial });
    } catch (err) {
        res.send(err);
    }
};

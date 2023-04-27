const {AdminJobRequest}=require("../models/adminJobRequest.module");

const {User}=require("../models/user.module");

const {UserSocial}=require("../models/user-social.module");

const {JobCategory}=require("../models/jobCategory.module");

exports.makeRequest=async(req,res)=>{
    const {
        jobName,
        category
    }=req.body;

    const id=req.params.id;

    let creatorType;

    try{
        if(!id || !jobName || !category){
            return res.send("Failed");
        }

        const existingUser=await User.findById(id);

        const existingUserSocial=await UserSocial.findById(id);

        if(!existingUser && !existingUserSocial){
            return res.send("No user exists");
        }else{
            if(existingUser){
                creatorType="basic";
            }else{
                creatorType="social";
            }
        }

        const existingCategory=await JobCategory.findOne({category});

        if(!existingCategory){
            return res.send("Category not found");
        }

        const newReq=await AdminJobRequest.create({
            jobName,
            category,
            creatorType,
            creatorId:id,
            creatorIdSocial:id,
        })

        res.json(newReq)

    }catch(err){
        res.send(err);
    }
}

exports.getRequests=async(req,res)=>{
    try{
        const allReq=await AdminJobRequest.find({}).populate("creatorId");

        const allReqSocial=await AdminJobRequest.find({}).populate("creatorIdSocial")

        const filtered=allReq.filter(req=>req.creatorId!=null);

        const filteredSocial=allReqSocial.filter(req=>req.creatorIdSocial!=null);

        res.json({basicUsers:filtered , socialUsers:filteredSocial});
    }catch(err){
        res.send(err);
    }
}
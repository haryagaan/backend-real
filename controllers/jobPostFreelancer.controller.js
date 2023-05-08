const {JobPostFreelancer}=require("../models/jobPostFreelancer.module");

const {Job}=require("../models/job.module")

const {User}=require("../models/user.module");

const {UserSocial}=require("../models/user-social.module");

exports.createPostFreelancer=async(req,res)=>{
    const id=req.params.id;

    const jobId=req.params.job;

    const {
        title,mainText,imageUrl,price
    }=req.body;

    if(!title || !mainText || !imageUrl || !price){
        return res.status(200).send("Failed");
    }

    if(!id || !jobId){
        return req.status(200).send("Ids required");
    }

    const existingUser=await User.findById(id);

    const existingUserSocial=await UserSocial.findById(id);

    const job=await Job.findById(jobId);

    if(!job){
        return res.status(200).send("Job not found");
    }

    if(!existingUser && !existingUserSocial){
        return res.status(200).send("User not found");
    }

    try{
        if(existingUser && !existingUserSocial){
            const newPostFreelancer=await JobPostFreelancer.create({
                title,
                mainText,
                imageUrl,
                price,
                jobId,
                creatorId:id,
                creatorSocialId:null
            });

            job.freelancerPosts.push(newPostFreelancer._id);

            await job.save();

            res.status(200).json(newPostFreelancer);
        }else if(existingUserSocial && !existingUser){
            const newPostFreelancer=await JobPostFreelancer.create({
                title,
                mainText,
                imageUrl,
                price,
                jobId,
                creatorId:null,
                creatorSocialId:id
            });

            job.freelancerPosts.push(newPostFreelancer._id);

            await job.save();

            res.status(200).json(newPostFreelancer);
        }
    }catch(err){
        res.send(err);
    }
}
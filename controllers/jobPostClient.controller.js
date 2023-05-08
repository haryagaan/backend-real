const {JobPostClient}=require("../models/jobPostClient.module");

const {Job}=require("../models/job.module");

const {User}=require("../models/user.module");

const {UserSocial}=require("../models/user-social.module")

exports.createPostClient=async(req,res)=>{
    const id=req.params.id;

    const jobId=req.params.job;

    const {
        title,mainText,imageUrl,price
    }=req.body;

    if(!title || !mainText || !price){
        return res.status(200).send("Failed")
    }

    if(!id || !jobId){
        return res.status(200).send("Insufficient request");
    }

    const existingUser=await User.findById(id);

    const existingUserSocial=await UserSocial.findById(id);

    if(!existingUser && !existingUserSocial){
        return res.status(200).send("User doesnt exist")
    }

    const job=await Job.findById(jobId);

    if(!job){
        return res.status(200).send("JOb doesnt exist");
    }

    try{
        if(existingUser && !existingUserSocial){
            const newPostClient=await JobPostClient.create({
                title,
                mainText,
                imageUrl,
                price,
                jobId,
                creatorId:id,
                creatorSocialId:null,
            });

            job.clientPosts.push(newPostClient._id);

            await job.save();
            
            res.status(200).json(newPostClient);
        }else if(existingUserSocial && !existingUser){
            const newPostClient=await JobPostClient.create({
                title,
                mainText,
                imageUrl,
                price,
                jobId,
                creatorId:null,
                creatorSocialId:id,
            });

            job.clientPosts.push(newPostClient._id);

            await job.save();
            
            res.status(200).json(newPostClient);
        }
    }catch(err){
        res.send(err);
    }
}
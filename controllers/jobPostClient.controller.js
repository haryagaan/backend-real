const {JobPostClient}=require("../models/jobPostClient.module");

const {Job}=require("../models/job.module");

const {User}=require("../models/user.module");

const {UserSocial}=require("../models/user-social.module")

const {cloudinary}=require("../cloudinary")

exports.createPostClient=async(req,res)=>{
    const id=req.params.id;

    const jobId=req.params.job;

    const {
        title,mainText,base64,price
    }=req.body;

    if(!title || !mainText || !base64 || !price){
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
            const result=await cloudinary.uploader.upload(base64 , {
                folder:"images"
            });

            const newPostClient=await JobPostClient.create({
                title,
                mainText,
                imageUrl:result.secure_url,
                price,
                jobId,
                creatorId:id,
                creatorSocialId:null,
            });

            job.clientPosts.push(newPostClient._id);

            await job.save();
            
            res.status(200).json(newPostClient);
        }else if(existingUserSocial && !existingUser){
            const result=await cloudinary.uploader.upload(base64 , {
                folder:"images"
            });

            const newPostClient=await JobPostClient.create({
                title,
                mainText,
                imageUrl:result.secure_url,
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

exports.getSpecificPostClient=async(req,res)=>{
    const postId=req.params.id;

    if(!postId){
        return res.status(400).send("Post id required");
    }

    try{
        const post=await JobPostClient.findById(postId);

        if(!post){
            return res.status(404).send("Post not found");
        }

        if(post.creatorId!=null){
            const creator=await JobPostClient.findById(postId).populate("creatorId");

            const category=await JobPostClient.findById(postId).populate({path:"jobId" , populate:{path:"category"}})

            res.status(200).json({category:category , creator:creator.creatorId});
        }else if(post.creatorSocialId!=null){
            const creator=await JobPostClient.findById(postId).populate("creatorSocialId");

            const category=await JobPostClient.findById(postId).populate({path:"jobId" , populate:{path:"category"}})

            res.status(200).json({category:category , creator:creator.creatorSocialId});
        }

    }catch(err){
        res.send(err);
    }
}
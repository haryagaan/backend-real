const {JobPostFreelancer}=require("../models/jobPostFreelancer.module");

const {Job}=require("../models/job.module");

const {User}=require("../models/user.module");

const {UserSocial}=require("../models/user-social.module");

const {cloudinary}=require("../cloudinary");

exports.createPostFreelancer=async(req,res)=>{
    const id=req.params.id;

    const jobId=req.params.job;

    const {
        title,mainText,base64,price
    }=req.body;

    if(!title || !mainText || !base64 || !price){
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
            let imageUrls=[];

            for(let i=0; i<base64.length ; i++){
                const result=await cloudinary.uploader.upload(base64[i] , {
                    folder:"images"
                });

                imageUrls.push(result.secure_url);
            }

            const newPostFreelancer=await JobPostFreelancer.create({
                title,
                mainText,
                imageUrl:imageUrls,
                price,
                jobId,
                creatorId:id,
                creatorSocialId:null
            });

            job.freelancerPosts.push(newPostFreelancer._id);

            await job.save();

            res.status(200).json(newPostFreelancer);
        }else if(existingUserSocial && !existingUser){
            let imageUrls=[];

            for(let i=0; i<base64.length ; i++){
                const result=await cloudinary.uploader.upload(base64[i] , {
                    folder:"images"
                });

                imageUrls.push(result.secure_url);
            }

            const newPostFreelancer=await JobPostFreelancer.create({
                title,
                mainText,
                imageUrl:imageUrls,
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

exports.getSpecificPostFreelancer=async(req,res)=>{
    const id=req.params.id;

    const postId=req.params.post;

    if(!postId || !id){
        return res.status(400).send("Failed");
    }

    try{
        const existingUser=await User.findById(id);

        const existingUserSocial=await UserSocial.findById(id);

        if(!existingUser && !existingUserSocial){
            return res.status(404).send("User not found");
        }

        const post=await JobPostFreelancer.findById(postId);

        if(!post){
            return res.status(404).send("Post not found");
        }

        if(post.creatorId!=null){
            const creator=await JobPostFreelancer.findById(postId).populate("creatorId");

            const category=await JobPostFreelancer.findById(postId).populate({path:"jobId" , populate:{path:"category"}});

            res.status(200).json({category:category , creator:creator.creatorId});
        }else if(post.creatorSocialId!=null){
            const creator=await JobPostFreelancer.findById(postId).populate("creatorSocialId");

            const category=await JobPostFreelancer.findById(postId).populate({path:"jobId" , populate:{path:"category"}});

            res.status(200).json({category:category , creator:creator.creatorSocialId});
        }


    }catch(err){
        res.send(err);
    }
}

exports.LikeFreelancerPost=async(req,res)=>{
    const id=req.params.id;

    const freelancerPostId=req.params.post;

    const existingUser=await User.findById(id);

    const existingUserSocial=await UserSocial.findById(id);

    if(!existingUser && !existingUserSocial){
        return res.status(404).send("Couldnt find user");
    }

    const freelancerPost=await JobPostFreelancer.findById(freelancerPostId);

    if(!freelancerPost){
        return res.status(404).send("Post not found");
    }

    try{
        const liked=freelancerPost.likes.indexOf(id);

        if(liked!=-1){
            const indexLiked=freelancerPost.likes.indexOf(id);

            const indexDislike=freelancerPost.dislikes.indexOf(id);

            const indexTotal=freelancerPost.totalReacts.indexOf(id);

            freelancerPost.likes.splice(indexLiked , 1);

            freelancerPost.dislikes.splice(indexDislike  , 1);

            freelancerPost.totalReacts.splice(indexTotal , 1);

            await freelancerPost.save();

            res.status(200).send("Like removed");

        }else if(liked==-1){
            const indexDisliked=freelancerPost.dislikes.indexOf(id);

            freelancerPost.dislikes.splice(indexDisliked , 1);

            freelancerPost.likes.push(id);

            freelancerPost.totalReacts.push(id);

            await freelancerPost.save();

            res.status(200).send("Like added");
        }
    }catch(err){
        res.send(err);
    }
}

exports.DislikeFreelancerPost=async(req,res)=>{
    const id=req.params.id;

    const freelancerPostId=req.params.post;

    const existingUser=await User.findById(id);

    const existingUserSocial=await UserSocial.findById(id);

    if(!existingUser && !existingUserSocial){
        return res.status(404).send("Couldnt find user");
    }

    const freelancerPost=await JobPostClient.findById(freelancerPostId);

    if(!freelancerPost){
        return res.status(404).send("Post not found");
    }

    try{
        const dislike=freelancerPost.dislikes.indexOf(id);

        if(dislike!=-1){
            const indexDislike=freelancerPost.dislikes.indexOf(id);

            const indexLike=freelancerPost.likes.indexOf(id);

            const indexTotal=freelancerPost.totalReacts.indexOf(id);

            freelancerPost.likes.splice(indexLike , 1);

            freelancerPost.dislikes.splice(indexDislike , 1);

            freelancerPost.totalReacts.splice(indexTotal , 1);

            await freelancerPost.save();

            res.status(200).send("Dislike removed");

        }else if(dislike==-1){
            const indexLike=freelancerPost.likes.indexOf(id);

            freelancerPost.likes.splice(indexLike , 1);

            freelancerPost.totalReacts.push(id);

            freelancerPost.dislikes.push(id);

            await freelancerPost.save();

            res.status(200).send("Dislike added");
        }
    }catch(err){
        res.send(err);
    }
}
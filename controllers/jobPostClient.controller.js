const {JobPostClient}=require("../models/jobPostClient.module");

const {Job}=require("../models/job.module");

const {User}=require("../models/user.module");

const {UserSocial}=require("../models/user-social.module")

const {cloudinary}=require("../cloudinary");

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
            let imageUrls=[];

            for(let i=0; i<base64.length ; i++){
                const result=await cloudinary.uploader.upload(base64[i] , {
                    folder:"images"
                });

                imageUrls.push(result.secure_url);
            }

            const newPostClient=await JobPostClient.create({
                title,
                mainText,
                imageUrl:imageUrls,
                price,
                jobId,
                creatorId:id,
                creatorSocialId:null,
            });

            job.clientPosts.push(newPostClient._id);

            await job.save();
            
            res.status(200).json(newPostClient);
        }else if(existingUserSocial && !existingUser){
            let imageUrls=[];

            for(let i=0; i<base64.length ; i++){
                const result=await cloudinary.uploader.upload(base64[i] , {
                    folder:"images"
                });

                imageUrls.push(result.secure_url);
            }

            const newPostClient=await JobPostClient.create({
                title,
                mainText,
                imageUrl:imageUrls,
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
    const postId=req.params.post;

    if(!postId){
        return res.status(400).send("Failed");
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

exports.LikeClientPost=async(req,res)=>{
    const id=req.params.id;

    const clientPostId=req.params.post;

    const existingUser=await User.findById(id);

    const existingUserSocial=await UserSocial.findById(id);

    if(!existingUser && !existingUserSocial){
        return res.status(404).send("Couldnt find user");
    }

    const clientPost=await JobPostClient.findById(clientPostId);

    if(!clientPost){
        return res.status(404).send("Post not found");
    }

    try{
        const liked=clientPost.likes.indexOf(id);

        if(liked!=-1){
            const indexLiked=clientPost.likes.indexOf(id);

            const indexDislike=clientPost.dislikes.indexOf(id);

            const indexTotal=clientPost.totalReacts.indexOf(id);

            clientPost.likes.splice(indexLiked , 1);

            clientPost.dislikes.splice(indexDislike  , 1);

            clientPost.totalReacts.splice(indexTotal , 1);

            await clientPost.save();

            res.status(200).send("Like removed");

        }else if(liked==-1){
            const indexDisliked=clientPost.dislikes.indexOf(id);

            if(indexDisliked!=-1){
                clientPost.dislikes.splice(indexDisliked , 1);
            }else if(indexDisliked==-1){
                clientPost.totalReacts.push(id);
            }

            clientPost.likes.push(id);

            await clientPost.save();

            res.status(200).send("Like added");
        }
    }catch(err){
        res.send(err);
    }
}

exports.DislikeClientPost=async(req,res)=>{
    const id=req.params.id;

    const clientPostId=req.params.post;

    const existingUser=await User.findById(id);

    const existingUserSocial=await UserSocial.findById(id);

    if(!existingUser && !existingUserSocial){
        return res.status(404).send("Couldnt find user");
    }

    const clientPost=await JobPostClient.findById(clientPostId);

    if(!clientPost){
        return res.status(404).send("Post not found");
    }

    try{
        const dislike=clientPost.dislikes.indexOf(id);

        if(dislike!=-1){
            const indexDislike=clientPost.dislikes.indexOf(id);

            const indexLike=clientPost.likes.indexOf(id);

            const indexTotal=clientPost.totalReacts.indexOf(id);

            clientPost.likes.splice(indexLike , 1);

            clientPost.dislikes.splice(indexDislike , 1);

            clientPost.totalReacts.splice(indexTotal , 1);

            await clientPost.save();

            res.status(200).send("Dislike removed");

        }else if(dislike==-1){
            const indexLike=clientPost.likes.indexOf(id);

            if(indexLike!=-1){
                clientPost.likes.splice(indexLike , 1);
            }else if(indexLike==-1){
                clientPost.totalReacts.push(id);
            }

            clientPost.dislikes.push(id);

            await clientPost.save();

            res.status(200).send("Dislike added");
        }
    }catch(err){
        res.send(err);
    }
}

exports.LikedOrDislikedClient=async(req,res)=>{
    const id=req.params.id;

    const postId=req.params.post;

    if(!id || !postId){
        return res.status(400).send("Failed");
    }

    const existingUser=await User.findById(id);

    const existingUserSocial=await UserSocial.findById(id);

    if(!existingUser && !existingUserSocial){
        return res.status(404).send("User not found");
    }

    const post=await JobPostClient.findById(postId);

    if(!post){
        return res.status(404).send("Post not found");
    }
    
    try{
        const indexLike=post.likes.indexOf(id);

        const indexDislike=post.dislikes.indexOf(id);

        res.status(200).json({liked:indexLike , disiked:indexDislike})
    }catch(err){
        res.send(err)
    }
}
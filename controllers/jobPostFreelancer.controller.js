const {JobPostFreelancer}=require("../models/jobPostFreelancer.module");

const {Job}=require("../models/job.module");

const {User}=require("../models/user.module");

const {UserSocial}=require("../models/user-social.module");

const {Comment}=require("../models/comment.module")

const {cloudinary}=require("../cloudinary");

const jwt=require("jsonwebtoken")

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

            existingUser.postFreelancers.push(newPostFreelancer._id);

            job.freelancerPosts.push(newPostFreelancer._id);

            await existingUser.save();

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

            existingUserSocial.postFreelancers.push(newPostFreelancer._id);

            job.freelancerPosts.push(newPostFreelancer._id);

            await existingUserSocial.save();

            await job.save();

            res.status(200).json(newPostFreelancer);
        }
    }catch(err){
        res.send(err);
    }
}

exports.getSpecificPostFreelancer=async(req,res)=>{
    const postId=req.params.post;

    if(!postId){
        return res.status(400).send("Failed");
    }

    try{
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

            if(indexDisliked!=-1){
                freelancerPost.dislikes.splice(indexDisliked , 1);
            }else if(indexDisliked==-1){
                freelancerPost.totalReacts.push(id);
            }

            freelancerPost.likes.push(id);

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

    const freelancerPost=await JobPostFreelancer.findById(freelancerPostId);

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

            if(indexLike!=-1){
                freelancerPost.likes.splice(indexLike , 1);
            }else if(indexLike==-1){
                freelancerPost.totalReacts.push(id);
            }

            freelancerPost.dislikes.push(id);

            await freelancerPost.save();

            res.status(200).send("Dislike added");
        }
    }catch(err){
        res.send(err);
    }
}

exports.LikedOrDislikedFreelancer=async(req,res)=>{
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

    const post=await JobPostFreelancer.findById(postId);

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

exports.writeCommentFreelancer=async(req,res)=>{
    const token=req.params.token;

    const postId=req.params.post;

    const {text}=req.body;

    if(!token || !postId || !text){
        return res.status(400).send("Failed");
    }

    try{
        const payload=jwt.verify(token , process.env.TOKEN_SECRET);

        const id=payload.user._id;

        const existingUser=await User.findById(id);

        const existingUserSocial=await UserSocial.findById(id);

        if(!existingUser && !existingUserSocial){
            return res.status(404).send("User not found");
        }

        const post=await JobPostFreelancer.findById(postId);

        if(!post){
            return res.status(404).send("Post not found");
        }

        const newComment=await Comment.create({
            creatorId:id,
            creatorSocialId:id,
            text,
        });

        post.comments.push(newComment._id);

        await post.save();

        res.status(200).json(post);
    }catch(err){
        res.send(err);
    }
}

exports.getCommentsFreelancer=async(req,res)=>{
    const postId=req.params.post

    if(!postId){
        return res.status(400).send("Failed");
    }

    try{
        let comments=[]

        const postSocial=await JobPostFreelancer.findById(postId).populate({path:"comments" , populate:{path:"creatorSocialId"}});

        const postBasic=await JobPostFreelancer.findById(postId).populate({path:"comments" , populate:{path:"creatorId"}});

        if(!postSocial && !postBasic){
            return res.status(404).send("Post not found");
        }

        for(let i=0;i<postBasic.comments.length;i++){
            if(postBasic.comments[i].creatorId!=null){
                comments.push(postBasic.comments[i])
            }
        }

        for(let i=0;i<postSocial.comments.length;i++){
            if(postSocial.comments[i].creatorSocialId!=null){
                comments.push(postSocial.comments[i])
            }
        }

        res.status(200).json(comments);
    }catch(err){
        res.send(err);
    }
}
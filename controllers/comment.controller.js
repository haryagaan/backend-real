const {Comment}=require("../models/comment.module");

const jwt=require("jsonwebtoken")

exports.getReply=async(req,res)=>{
    const commentId=req.params.comment;

    if(!commentId){
        return res.status(400).send("comment id required");
    }

    try{
        let replies=[];

        const commentBasic=await Comment.findById(commentId).populate({path:"replies" , populate:{path:"creatorId"}});

        const commentSocial=await Comment.findById(commentId).populate({path:"replies" , populate:{path:"creatorSocialId"}})

        if(!commentBasic && !commentSocial){
            return res.status(404).send("Comment not found");
        }

        commentBasic.replies.map((reply , i)=>{
            if(reply.creatorId!=null){
                replies.push(reply);
            }
        })

        commentSocial.replies.map((reply,i)=>{
            if(reply.creatorSocialId!=null){
                replies.push(reply);
            }
        })

        res.status(200).json(replies);

    }catch(err){
        res.send(err);
    }
}

exports.writeReply=async(req,res)=>{
    const commentId=req.params.comment;

    const token=req.params.token;

    const {text}=req.body;

    if(!commentId || !token || !text){
        return res.status(400).send("Failed");
    }

    const comment=await Comment.findById(commentId);

    if(!comment){
        return res.status(400).send("Comment not found");
    }

    try{
        const payload=jwt.verify(token , process.env.TOKEN_SECRET);

        const id=payload.user._id;

        const newReply=await Comment.create({
            creatorId:id,
            creatorSocialId:id,
            text
        });

        comment.replies.push(newReply._id);

        await comment.save();

        res.status(200).json(comment);
    }catch(err){
        res.send(err);
    }
}
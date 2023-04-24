const { UserSocial }=require("../models/user-social.module");

exports.SocialAuth=async(req,res)=>{
    const {
        displayName,
        email,
        socialUid,
        socialType,
        imageUrl,
    }=req.body;

    try{
        const existingUser=await UserSocial.findOne({socialUid:socialUid});

        if(existingUser){
            res.status(200).json({user:existingUser , isNew:false});
        }else{
            const spaceIndex=displayName.indexOf(" ");

            const firstName=displayName.slice(0,spaceIndex);

            const lastName=displayName.slice(spaceIndex+1 , displayName.length);    

            const newUser=await UserSocial.create({
                firstName,lastName,email,imageUrl,socialType,socialUid
            });

            await newUser.save();

            res.status(201).json({user:newUser , isNew:true});
        }
    }catch(err){
        res.status(400).send(err);
    }
}
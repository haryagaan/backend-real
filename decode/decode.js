exports.decodeToken=async(req,res)=>{
    const token=req.headers.authorization;

    try{
        // if(!token){
        //     return res.status(400).send("Token required");
        // }

        // const user=jwt.verify(token , process.env.TOKEN_SECRET , (err,item)=>{
        //     if(!err){
        //         return item.existingUser
        //     }else{
        //         return res.status(400).send("Invalid token");
        //     }
        // })

        // res.status(200).json({user:user});

        // console.log(user)

        console.log(token)
    }catch(err){
        res.send(err);
    }
}
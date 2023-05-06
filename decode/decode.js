exports.decodeToken=async(req,res)=>{
    const {token}=req.body.token;

    try{
        // if(!token){
        //     return res.status(400).send("Token required");
        // }


        console.log(token)
        // res.send(token)
    }catch(err){
        res.send(err);
    }
}
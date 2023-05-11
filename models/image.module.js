const mongoose=require("mongoose");

const imageSchema=new mongoose.Schema({
    name:String,
    
    img:{
        type:String,
    }
})

exports.Images=mongoose.model("images" , imageSchema);
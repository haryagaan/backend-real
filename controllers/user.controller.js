const { User } = require('../models/user.module');

const {UserSocial}=require("../models/user-social.module")

const bcrypt = require('bcrypt');

const {emailForgotPassword}=require("../email/emailForgotPassword");

const jwt=require("jsonwebtoken");

exports.getUsers = async (req, res) => {
    try {
        const users = await User.find({});

        const usersSocial=await UserSocial.find({});

        res.status(200).json({basic:users , usersSocial:usersSocial});

    } catch (err) {
        throw res.send(err);
    }
};

exports.getUser = async (req, res) => {
    const id=req.params.id;

    try {
        if(!id){
            return res.status(400).send("Id required");
        }

        const existingUser=await User.findById(id);

        const existingUserSocial=await UserSocial.findById(id);

        if(!existingUser && !existingUserSocial){
            return res.send("No user found");
        }else{
            if(existingUser){
                existingUser.password=undefined;
                return res.json({user:existingUser});
            }else{
                existingUserSocial.password=undefined;
                return res.json({user:existingUserSocial});
            }
        }
      
    } catch (err) {
        throw res.send(err);
    }
};

exports.createRole = async (req, res) => {
    const body = req.body || {};

    try {
        if (!body.firstName || !body.lastName || !body.email) return res.send('name, password, email is required');

        const user = await User.findOne({
            firstName: body.firstName,
            lastName: body.lastName,
            email: body.email,
        });

        if (!user) {
            return res.status(404).send('Couldnt find user');
        }

        const { role } = body;

        if (![200, 300, 999].includes(role.user)) {
            return res.status(400).send('Invalid role');
        }

        user.role = body.role;

        await user.save();

        res.json(user);
    } catch (error) {
        res.send(error);
    }
};

exports.deleteUser = async (req, res) => {
    const id=req.params.id;

    try {
        if(!id){
            return res.status(400).send("Id required");
        }

        const user=await User.findById(id);

        const userSocial=await UserSocial.findById(id);

        if(!user && ! userSocial){
            res.status(404).send("User doesnt exist");
        }else{
            if(user && user.role.user==process.env.ADMIN){
                res.status(400).send("Cant delete admin");
            }else if(userSocial && userSocial.role.user==process.env.ADMIN){
                res.status(400).send("Cant delete admin")
            }else{
                const deleteUser = await User.findByIdAndDelete(id);

                const deleteUserSocial=await UserSocial.findByIdAndDelete(id);

                res.status(200).send("User deleted");
            }
        }

    } catch (err) {
        throw res.send(err);
    }
};

exports.forgotPassword=async(req,res)=>{
    const token=req.headers.authorization ?? null;

    const id=req.params.id;

    try{
        if(!token){
            return res.status(404).send("Token required");
        }

        if(!id){
            return res.status(400).send("Id required");
        }

        const user=await User.findById(id);

        if(!user){
            return res.status(404).send("Couldnt find the user");
        }

        //

        const payload=jwt.verify(token , process.env.TOKEN_SECRET , (err,item)=>{
            if(!err){
                return item.existingUser;
            }else{
                return res.status(400).send("Invalid token");
            }
        })

        if(payload._id!=id || payload.isVerified!=true || payload.verificationMethod!="email"){
            return res.status(400).send("You dont have a permission");
        }
        
        const number=(Math.floor(100000 + Math.random() * 900000));

        user.forgotPasswordCode=number;

        user.forgotPassword=true;

        await user.save();

        emailForgotPassword(user.email , number);

        res.status(200).send("We sent verification code to your email");

    }catch(err){
        res.send(err)
    }
}

exports.resetPassword=async(req,res)=>{
    const token=req.headers.authorization ?? null;

    const id=req.params.id;

    const {
        code,
        newPassword,
    }=req.body;

    try{
        if(!id){
            return res.status(400).send("Id required");
        }

        if(!code || !newPassword){
            return res.status(400).send("Failed , code and new password required");
        }

        const user=await User.findById(id);

        if(!user){
            return res.status(404).send("Couldn't find user");
        }

        const payload=jwt.verify(token , process.env.TOKEN_SECRET , (err,item)=>{
            if(!err){
                return item.existingUser;
            }else{
                return res.status(400).send("Invalid token");
            }
        })

        if(payload._id!=id){
            return res.status(400).send("You dont have a permission");
        }

        if(user.forgotPassword==false || code!=user.forgotPasswordCode){
            return res.status(400).send("Failed to reset password");
        }

        if(newPassword.length<6){
            return res.status(400).send("New password must be longer than 6 characters");
        }

        const isValidPassword=await bcrypt.compare(newPassword , user.password);

        if(isValidPassword){
            return res.status(200).send("Your new password cannot be the same as your old password");
        }

        const salt = await bcrypt.genSalt(10);

        const hashPassword=await bcrypt.hash(newPassword,salt);

        user.password=hashPassword;

        user.forgotPasswordCode=undefined;

        user.forgotPassword=false;

        await user.save();

        res.status(200).send("Your password has changed");

    }catch(err){
        res.send(err);
    }
}
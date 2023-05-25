const { User } = require('../models/user.module');

const { UserSocial } = require('../models/user-social.module');

const bcrypt = require('bcrypt');

const { emailForgotPassword } = require('../email/emailForgotPassword');

const jwt = require('jsonwebtoken');

const {cloudinary}=require("../cloudinary");

exports.setProfileImage=async(req,res)=>{
    const token=req.params.token;

    const {base64}=req.body;

    if(!token || !base64){
        return res.status(400).send("Token or image required");
    }

    try{
        const payload=jwt.verify(token , process.env.TOKEN_SECRET);

        const id=payload.user._id;

        const existingUser=await User.findById(id);

        const existingUserSocial=await UserSocial.findById(id);

        if(!existingUser && !existingUserSocial){
            return res.status(404).send("User not found");
        }

        if(existingUser){
            const result=await cloudinary.uploader.upload(base64 , {
                folder:"images"
            });
        
            existingUser.imageUrl=result.secure_url;

            await existingUser.save();

            res.send("Profile picture changed");
        }else if(existingUserSocial){
            const result=await cloudinary.uploader.upload(image , {
                folder:"images"
            });
        
            existingUserSocial.imageUrl=result.secure_url;

            await existingUserSocial.save();

            res.send("Profile picture changed");
        }

    }catch(err){
        res.send(err);
    }
}

exports.setGalleryImage=async(req,res)=>{
    const token=req.params.token;

    const {base64}=req.body;

    if(!token || !base64){
        return res.status(400).send("Token or image required");
    }

    try{
        const payload=jwt.verify(token , process.env.TOKEN_SECRET);

        const id=payload.user._id;

        const existingUser=await User.findById(id);

        const existingUserSocial=await UserSocial.findById(id);

        if(!existingUser && !existingUserSocial){
            return res.status(404).send("User doesnt exist");
        }

        if(existingUser){
            if(existingUser.galleryUrls.length<4){
                const result=await cloudinary.uploader.upload(base64 , {
                    folder:"images"
                });
    
                existingUser.galleryUrls.push(result.secure_url);
    
                await existingUser.save();
    
                res.status(200).send("Added to gallery");
            }else if(existingUser.galleryUrls.length>=4){
                const result=await cloudinary.uploader.upload(base64 , {
                    folder:"images"
                });

                existingUser.galleryUrls[0]=result.secure_url;

                await existingUser.save();

                res.status(200).send("Replaced with existing pic")
            }
        }else if(existingUserSocial){
            if(existingUserSocial.galleryUrls.length<4){
                const result=await cloudinary.uploader.upload(base64 , {
                    folder:"images"
                });
    
                existingUserSocial.galleryUrls.push(result.secure_url);
    
                await existingUserSocial.save();
    
                res.status(200).send("Added to gallery");
            }else if(existingUserSocial.galleryUrls.length>=4){
                const result=await cloudinary.uploader.upload(base64 , {
                    folder:"images"
                });

                existingUserSocial.galleryUrls[0]=result.secure_url;

                await existingUserSocial.save();

                res.status(200).send("Replaced with existing pic")
            }
        }
    }catch(err){
        res.send(err);
    }
}

exports.changeUserInfo=async(req,res)=>{
    const token=req.params.token;

    const {info,facebook,instagram,google,phone}=req.body; 

    if(!token){
        return res.status(400).send("Token required");
    }

    try{
        const payload=jwt.verify(token , process.env.TOKEN_SECRET);

        const id=payload.user._id;

        const existingUser=await User.findById(id);

        const existingUserSocial=await UserSocial.findById(id);

        if(!existingUser && !existingUserSocial){
            return res.status(404).send("User not found");
        }

       if(existingUser){
        if(facebook!=null){
            existingUser.facebookInfo=facebook;
        }
        if(instagram!=null){
            existingUser.instagramInfo=instagram;
        }
        if(google!=null){
            existingUser.googleInfo=google;
        }
        if(phone!=null){
            if(phone.length==8){
                existingUser.phoneInfo=phone;
            }else{
                return res.status(400).send("Phone number must be 8 characters long")
            }
        }
        if(info!=null){
            existingUser.infoText=info;
        }

        await existingUser.save();

        res.status(200).send("Changed")
       }else if(existingUserSocial){
            if(facebook!=null){
                existingUserSocial.facebookInfo=facebook;
            }
            if(instagram!=null){
                existingUserSocial.instagramInfo=instagram;
            }
            if(google!=null){
                existingUserSocial.googleInfo=google;
            }
            if(phone!=null){
                if(phone.length==8){
                    existingUserSocial.phoneInfo=phone;
                }else{
                    return res.status(400).send("Phone number must be 8 characters long")
                }
            }
            if(info!=null){
                existingUserSocial.infoText=info;
            }

            await existingUserSocial.save();

            res.status(200).send("Changed")
       }
    }catch(err){
        res.send(err);
    }
}


exports.getUsers = async (req, res) => {
    try {
        const users = await User.find({});

        const usersSocial = await UserSocial.find({});

        let allUsers=[];

        usersSocial.map((user,i)=>{
            allUsers.push({likes:user.likes.length , user:user});
        })

        users.map((user , i)=>{
            allUsers.push({likes:user.likes.length , user:user});
        })

        allUsers.sort((a,b)=>a.likes > b.likes ? 1 : -1)

        allUsers.reverse();

        let popular10=allUsers.slice(0,10)

        res.status(200).json(allUsers)

    } catch (err) {
        throw res.send(err);
    }
};

exports.getUser = async (req, res) => {
    const id = req.params.id;

    try {
        if (!id) {
            return res.status(400).send('Id required');
        }

        const existingUser = await User.findById(id);

        const existingUserSocial = await UserSocial.findById(id);

        if (!existingUser && !existingUserSocial) {
            return res.send('No user found');
        } else {
            if (existingUser) {
                const postsFreelancer=await User.findById(id).populate("postFreelancers");

                const postsClient=await User.findById(id).populate("postClients");

                existingUser.password = undefined;
                return res.json({ user: existingUser , postFreelancers:postsFreelancer.postFreelancers , postClients:postsClient.postClients });
            } else {
                const postsFreelancer=await UserSocial.findById(id).populate("postFreelancers");

                const postsClient=await UserSocial.findById(id).populate("postClients");

                existingUserSocial.password = undefined;
                return res.json({ user: existingUserSocial , postFreelancers:postsFreelancer.postFreelancers , postClients:postsClient.postClients});
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

// exports.updateUser = async (req, res) => {
//     const data = req.body;

//     const id = req.params.id;

//     try {
//         if(!data || !id){
//             return res.status(400).send("body , id required");
//         }

//         const user = await User.findById(id);

//         if (!user) {
//             return res.status(404).send('Couldnt find user');
//         }
//         Object.assign(user, data);

//         await user.save();

//         res.status(200).json(user);
//     } catch (err) {
//         throw res.send(err);
//     }
// };

exports.deleteUser = async (req, res) => {
    const id = req.params.id;

    try {
        if (!id) {
            return res.status(400).send('Id required');
        }

        const user = await User.findById(id);

        const userSocial = await UserSocial.findById(id);

        if (!user && !userSocial) {
            res.status(404).send('User doesnt exist');
        } else {
            if (user && user.role.user == process.env.ADMIN) {
                res.status(400).send('Cant delete admin');
            } else if (userSocial && userSocial.role.user == process.env.ADMIN) {
                res.status(400).send('Cant delete admin');
            } else {
                const deleteUser = await User.findByIdAndDelete(id);

                const deleteUserSocial = await UserSocial.findByIdAndDelete(id);

                res.status(200).send('User deleted');
            }
        }
    } catch (err) {
        throw res.send(err);
    }
};

exports.forgotPassword = async (req, res) => {
    const token = req.headers.authorization ?? null;

    const id = req.params.id;

    try {
        if (!token) {
            return res.status(404).send('Token required');
        }

        if (!id) {
            return res.status(400).send('Id required');
        }

        const user = await User.findById(id);

        if (!user) {
            return res.status(404).send('Couldnt find the user');
        }

        //

        const payload = jwt.verify(token, process.env.TOKEN_SECRET, (err, item) => {
            if (!err) {
                return item.user;
            } else {
                return res.status(400).send('Invalid token');
            }
        });

        if (payload._id != id || payload.isVerified != true) {
            return res.status(400).send('You dont have a permission');
        }

        const number = Math.floor(100000 + Math.random() * 900000);

        user.forgotPasswordCode = number;

        user.forgotPassword = true;

        await user.save();

        emailForgotPassword(user.email, number);

        res.status(200).send('We sent verification code to your email');
    } catch (err) {
        res.send(err);
    }
};

exports.resetPassword = async (req, res) => {
    const token = req.headers.authorization ?? null;

    const id = req.params.id;

    const { code, newPassword } = req.body;

    try {
        if (!id) {
            return res.status(400).send('Id required');
        }

        if (!code || !newPassword) {
            return res.status(400).send('Failed , code and new password required');
        }

        const user = await User.findById(id);

        if (!user) {
            return res.status(404).send("Couldn't find user");
        }

        const payload = jwt.verify(token, process.env.TOKEN_SECRET, (err, item) => {
            if (!err) {
                return item.user;
            } else {
                return res.status(400).send('Invalid token');
            }
        });

        if (payload._id != id) {
            return res.status(400).send('You dont have a permission');
        }

        if (user.forgotPassword == false || code != user.forgotPasswordCode) {
            return res.status(400).send('Failed to reset password');
        }

        if (newPassword.length < 6) {
            return res.status(400).send('New password must be longer than 6 characters');
        }

        const isValidPassword = await bcrypt.compare(newPassword, user.password);

        if (isValidPassword) {
            return res.status(200).send('Your new password cannot be the same as your old password');
        }

        const salt = await bcrypt.genSalt(10);

        const hashPassword = await bcrypt.hash(newPassword, salt);

        user.password = hashPassword;

        user.forgotPasswordCode = undefined;

        user.forgotPassword = false;

        await user.save();

        res.status(200).send('Your password has changed');
    } catch (err) {
        res.send(err);
    }
};

exports.returnIdFromToken=async(req,res)=>{
    const token=req.params.token;

    if(!token){
        return res.status(400).send("Token required");
    }

    try{
        const payload=jwt.verify(token , process.env.TOKEN_SECRET);

        res.json(payload.user._id);
    }catch(err){
        res.send(err);
    }
}

exports.LikeUser=async(req,res)=>{
    const id=req.params.id;

    const userId=req.params.user;

    if(!id || !userId){
        return res.status(400).send("Failed");
    }

    if(id==userId){
        return res.status(400).send("You cant Like to your own profile")
    }

    const existingAcc=await User.findById(userId);

    const existingAccSocial=await UserSocial.findById(userId);

    if(!existingAcc && !existingAccSocial){
        return res.status(404).send("Account not found");
    }

    try{
        if(existingAcc && !existingAccSocial){
            const indexLiked=existingAcc.likes.indexOf(id);

            const indexDisliked=existingAcc.dislikes.indexOf(id);

            const indexTotalReacts=existingAcc.totalReacts.indexOf(id);

            if(indexLiked==-1){
                //no like from the start

                if(indexDisliked==-1){
                    // existingAcc.totalReacts.splice(indexTotalReacts , 1);

                    // existingAcc.dislikes.splice(indexDisliked , 1);

                    existingAcc.likes.push(id);

                    existingAcc.totalReacts.push(id);

                    await existingAcc.save();

                    res.status(200).send("Like added");
                }else if(indexDisliked!=-1){
                    // existingAcc.totalReacts.splice(indexTotalReacts , 1);

                    existingAcc.dislikes.splice(indexDisliked , 1);

                    existingAcc.likes.push(id);

                    // existingAcc.totalReacts.push(id);

                    await existingAcc.save();

                    res.status(200).send("Like added");
                }

            }else if(indexLiked!=-1){
                //likes from the start
                existingAcc.totalReacts.splice(indexTotalReacts , 1);

                existingAcc.likes.splice(indexLiked , 1);

                await existingAcc.save();

                res.status(200).send("Like added");
            }
        }else if(existingAccSocial && !existingAcc){
            const indexLiked=existingAccSocial.likes.indexOf(id);

            const indexDisliked=existingAccSocial.dislikes.indexOf(id);

            const indexTotalReacts=existingAccSocial.totalReacts.indexOf(id);

            if(indexLiked==-1){
                //no like from the start

                if(indexDisliked==-1){
                    // existingAccSocial.totalReacts.splice(indexTotalReacts , 1);

                    existingAccSocial.likes.push(id);

                    existingAccSocial.totalReacts.push(id);

                    await existingAccSocial.save();

                    res.status(200).send("Like added");
                }else if(indexDisliked!=-1){
                    // existingAccSocial.totalReacts.splice(indexTotalReacts , 1);

                    existingAccSocial.dislikes.splice(indexDisliked , 1);

                    existingAccSocial.likes.push(id);

                    // existingAccSocial.totalReacts.push(id);

                    await existingAccSocial.save();

                    res.status(200).send("Like added");
                }

            }else if(indexLiked!=-1){
                //likes from the start
                existingAccSocial.totalReacts.splice(indexTotalReacts , 1);

                existingAccSocial.likes.splice(indexLiked , 1);

                await existingAccSocial.save();

                res.status(200).send("Like added");
            }
        }
    }catch(err){
        res.send(err);
    }
}

exports.DislikeUser=async(req,res)=>{
    const id=req.params.id;

    const userId=req.params.user;

    if(!id || !userId){
        return res.status(400).send("Failed");
    }

    
    if(id==userId){
        return res.status(400).send("You cant dislike to your own profile")
    }

    const existingAcc=await User.findById(userId);

    const existingAccSocial=await UserSocial.findById(userId);

    if(!existingAcc && !existingAccSocial){
        return res.status(404).send("Account not found");
    }

    try{
        if(existingAcc && !existingAccSocial){
            const indexLiked=existingAcc.likes.indexOf(id);

            const indexDisliked=existingAcc.dislikes.indexOf(id);

            const indexTotalReacts=existingAcc.totalReacts.indexOf(id);

            if(indexDisliked==-1){
                //no dislike from the start
                if(indexLiked==-1){
                    // existingAcc.totalReacts.splice(indexTotalReacts , 1);

                    existingAcc.dislikes.push(id);

                    existingAcc.totalReacts.push(id);

                    await existingAcc.save();

                    res.status(200).send("Dislike added");
                }else if(indexLiked!=-1){
                    existingAcc.likes.splice(indexLiked , 1);

                    existingAcc.dislikes.push(id);

                    await existingAcc.save();

                    res.status(200).send("Dislike added");
                }
            }else if(indexDisliked!=-1){
                //disliked from the start
                existingAcc.totalReacts.splice(indexTotalReacts , 1);

                existingAcc.dislikes.splice(indexDisliked , 1);

                await existingAcc.save();

                res.status(200).send("Dislike added");
            }
        }else if(existingAccSocial && !existingAcc){
            const indexLiked=existingAccSocial.likes.indexOf(id);

            const indexDisliked=existingAccSocial.dislikes.indexOf(id);

            const indexTotalReacts=existingAccSocial.totalReacts.indexOf(id);

            if(indexDisliked==-1){
                //no dislike from the start
                if(indexLiked==-1){
                    // existingAccSocial.totalReacts.splice(indexTotalReacts , 1);

                    existingAccSocial.dislikes.push(id);

                    existingAccSocial.totalReacts.push(id);

                    await existingAccSocial.save();

                    res.status(200).send("Dislike added");
                }else if(indexLiked!=-1){
                    existingAccSocial.likes.splice(indexLiked , 1);

                    existingAccSocial.dislikes.push(id);

                    await existingAccSocial.save();

                    res.status(200).send("Dislike added");
                }
            }else if(indexDisliked!=-1){
                //disliked from the start
                existingAccSocial.totalReacts.splice(indexTotalReacts , 1);

                existingAccSocial.dislikes.splice(indexDisliked , 1);

                await existingAccSocial.save();

                res.status(200).send("Dislike added");
            }
        }
    }catch(err){
        res.send(err);
    }
}
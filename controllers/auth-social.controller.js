const { UserSocial } = require('../models/user-social.module');

const jwt=require("jsonwebtoken");

exports.SocialAuth = async (req, res) => {
    const { displayName, email, socialUid, socialType, imageUrl , role } = req.body;

    const userRole = role == 300 ? { user: 300 } : { user: 200 };

    try {
        const existingUser = await UserSocial.findOne({ socialUid: socialUid });

        if (existingUser) {
            const userToken=jwt.sign({user:existingUser} , process.env.TOKEN_SECRET , {
                expiresIn:"6h"
            })

            res.status(200).json({ token: userToken, isNew: false });
        } else {
            const spaceIndex = displayName.indexOf(' ');

            const firstName = displayName.slice(0, spaceIndex);

            const lastName = displayName.slice(spaceIndex + 1, displayName.length);

            const newUser = await UserSocial.create({
                firstName,
                lastName,
                email,
                imageUrl,
                socialType,
                socialUid,
                role:userRole
            });

            await newUser.save();

            const userToken=jwt.sign({user:newUser} , process.env.TOKEN_SECRET , {
                expiresIn:"6h"
            })

            res.status(200).json({ token:userToken, isNew: true });
        }
    } catch (err) {
        res.status(400).send(err);
    }
};
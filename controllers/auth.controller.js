const { User } = require('../models/user.module');

const bcrypt = require('bcrypt');

const { validationResult } = require('express-validator');

const { emailSender } = require('../email/emailSender');

const jwt = require('jsonwebtoken');

const { tokenGenerator } = require('../services/tokenGenerator');

exports.Signup = async (req, res) => {
    const { firstName, lastName, email, password, role } = req.body;

    const userRole = role == 300 ? { user: 300 } : { user: 200 };

    if (!firstName || !lastName || !email || !password ) {
        return res.status(400).send('Fill in all the forms');
    }

    const existingEmail = await User.findOne({ email: email });

    if (existingEmail) {
        return res.status(404).send('Email already exists');
    }

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        if (errors.errors[0].param == 'email') {
            return res.status(400).send('Invalid email');
        }

        if (errors.errors[0].param == 'password') {
            return res.status(400).send('Password must be longer than 6 characters and less than 30 characters');
        }

        if (errors.errors[0].param == 'lastName') {
            return res.status(400).send('Lastname must be longer than 2 characters and less than 30 characters');
        }

        if (errors.errors[0].param == 'firstName') {
            return res.status(400).send('Firstname must be longer than 2 characters and less than 30 characters');
        }
    }

    try {
        const salt = await bcrypt.genSalt(10);

        const hashPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            firstName,
            lastName,
            email,
            password: hashPassword,
            role: userRole,
        });

        const newUserId = newUser._id;

        const token = jwt.sign({ id: newUserId }, process.env.TOKEN_SECRET, {
            expiresIn: '3m',
        });

        const url = process.env.BASE_URL_BACKEND + '/email/confirm/' + token;

        emailSender(email, url);

        res.status(200).send('created');
    } catch (err) {
        res.status(404).send(err);
    }
};

exports.Login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).send('Fill in all forms');
    }

    try {
        const existingUser = await User.findOne({ email: email });

        if (!existingUser) {
            return res.status(404).send('Couldnt find user');
        }

        const isValidPassword = await bcrypt.compare(password, existingUser.password);

        if (!isValidPassword) {
            return res.status(400).send('Password incorrect');
        }

        existingUser.password = undefined;

        existingUser.forgotPasswordCode=undefined;
        // existingUser.firstName=undefined;
        // existingUser.lastName=undefined

        // const id=existingUser._id;

        const userToken=jwt.sign({user:existingUser} , process.env.TOKEN_SECRET , {
            expiresIn:"6h"
        })

        res.status(200).json({token: userToken , user:existingUser , isVerified:existingUser.isVerified });
        
    } catch (err) {
        res.status(400).send(err);
    }
};

exports.VerifyPhone=async(req,res)=>{
    const id=req.params.id;

    const {phone}=req.body;

    try{
        if(!id || !phone){
            return res.status(400).send("Id or phone required");
        }

        const existingUser=await User.findById(id);

        if(!existingUser){
            return res.status(404).send("User not found");
        }

        existingUser.isVerified=true;

        existingUser.phoneInfo=phone;

        await existingUser.save();

        res.send("user verified")

    }catch(err){
        res.send(err);
    }
}
const express = require('express');

const passport = require('passport');

const { body } = require('express-validator');

const { Signup, Login , VerifyPhone } = require('../controllers/auth.controller');

const authRouter = express.Router();

authRouter
    .post(
        '/signup',
        body('email').isEmail(),
        body('password').isLength({ min: 6, max: 30 }),
        body('firstName').isLength({ min: 2, max: 30 }),
        body('lastName').isLength({ min: 2, max: 30 }),
        Signup,
    )

    .post('/login', Login)
    .post("/verify/:id" , VerifyPhone)

module.exports = authRouter;

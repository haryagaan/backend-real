const express = require('express');

const { SocialAuth } = require('../controllers/auth-social.controller');

const authSocialRouter = express.Router();

authSocialRouter.post('/social/create', SocialAuth);
module.exports = authSocialRouter;

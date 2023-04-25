const express = require('express');

const { emailConfirmation, sendUrl } = require('../controllers/email.controller');

const emailRouter = express.Router();

emailRouter.get('/confirm/:token', emailConfirmation).post('/send/:id', sendUrl);
module.exports = emailRouter;

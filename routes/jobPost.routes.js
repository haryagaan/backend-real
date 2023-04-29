const express = require('express');

const {authMiddleware} =require("../middleware/authMiddleware");

const {roleMiddleware}=require("../middleware/roleMiddleware");

const { createPost, deletePost } = require('../controllers/jobPost.controller');

const jobPostRouter = express.Router();

jobPostRouter.post('/create/:id/:job/:category', authMiddleware , createPost).post('/delete/:id/:post', roleMiddleware(999) ,deletePost);
module.exports = jobPostRouter;
const express = require('express');

const { authMiddleware } = require('../middleware/authMiddleware');

const { roleMiddleware } = require('../middleware/roleMiddleware');

const { createPost, deletePost } = require('../controllers/jobPost.controller');

const jobPostRouter = express.Router();

jobPostRouter
    .post('/create/:id/:job/:category', createPost)
    //roleMiddleware hiigeegui baihiin uchirn adminaas gadna postiin creator n ustgaj bolno
    .delete('/delete/:id/:post', deletePost);
module.exports = jobPostRouter;

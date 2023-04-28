const express = require('express');

const { createPost , deletePost } = require('../controllers/jobPost.controller');

const jobPostRouter = express.Router();

jobPostRouter.post("/create/:id/:job/:category" , createPost).post("/delete/:id/:post" , deletePost)
module.exports = jobPostRouter;
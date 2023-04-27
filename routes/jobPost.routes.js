const express = require('express');

const { createPost } = require('../controllers/jobPost.controller');

const jobPostRouter = express.Router();

jobPostRouter.post("/create/:id/:job/:category" , createPost)
module.exports = jobPostRouter;
const express = require('express');

const { authMiddleware } = require('../middleware/authMiddleware');

const { roleMiddleware } = require('../middleware/roleMiddleware');

const {
    createPostFreelancer,
    getSpecificPostFreelancer,
    LikeFreelancerPost,
    DislikeFreelancerPost
}=require("../controllers/jobPostFreelancer.controller");

const jobPostFreelancerRouter = express.Router();

jobPostFreelancerRouter
    .post("/freelancer/:id/:job" , createPostFreelancer)
    .post("/freelancer/like/:id/:post",LikeFreelancerPost)
    .post("/freelancer/dislike/:id/:post" , DislikeFreelancerPost)
    .get("/freelancer/:id/:post" , getSpecificPostFreelancer)
module.exports = jobPostFreelancerRouter;

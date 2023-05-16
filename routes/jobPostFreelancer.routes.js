const express = require('express');

const { authMiddleware } = require('../middleware/authMiddleware');

const { roleMiddleware } = require('../middleware/roleMiddleware');

const {
    createPostFreelancer,
    getSpecificPostFreelancer,
    LikeFreelancerPost,
    DislikeFreelancerPost,
    LikedOrDislikedFreelancer
}=require("../controllers/jobPostFreelancer.controller");

const jobPostFreelancerRouter = express.Router();

jobPostFreelancerRouter
    .post("/freelancer/:id/:job" , createPostFreelancer)
    .post("/freelancer/like/:id/:post",LikeFreelancerPost)
    .post("/freelancer/dislike/:id/:post" , DislikeFreelancerPost)
    .get("/freelancer/react/:id/:post" , LikedOrDislikedFreelancer)
    .get("/freelancer/:post" , getSpecificPostFreelancer)
module.exports = jobPostFreelancerRouter;

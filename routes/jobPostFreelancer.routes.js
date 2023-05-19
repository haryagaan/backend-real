const express = require('express');

const { authMiddleware } = require('../middleware/authMiddleware');

const { roleMiddleware } = require('../middleware/roleMiddleware');

const {
    createPostFreelancer,
    getSpecificPostFreelancer,
    LikeFreelancerPost,
    DislikeFreelancerPost,
    LikedOrDislikedFreelancer,
    writeCommentFreelancer,
    getCommentsFreelancer
}=require("../controllers/jobPostFreelancer.controller");

const jobPostFreelancerRouter = express.Router();

jobPostFreelancerRouter
    .post("/freelancer/:id/:job" , createPostFreelancer)
    .post("/freelancer/like/:id/:post",LikeFreelancerPost)
    .post("/freelancer/dislike/:id/:post" , DislikeFreelancerPost)
    .post("/freelancer/comment/:token/:post" , writeCommentFreelancer)
    .get("/freelancer/react/:id/:post" , LikedOrDislikedFreelancer)
    .get("/freelancer/:post" , getSpecificPostFreelancer)
    .get("/freelancer/comment/:post" , getCommentsFreelancer)
module.exports = jobPostFreelancerRouter;

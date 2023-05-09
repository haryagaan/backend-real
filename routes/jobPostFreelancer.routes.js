const express = require('express');

const { authMiddleware } = require('../middleware/authMiddleware');

const { roleMiddleware } = require('../middleware/roleMiddleware');

const {
    createPostFreelancer,
    getSpecificPostFreelancer
}=require("../controllers/jobPostFreelancer.controller");

const jobPostFreelancerRouter = express.Router();

jobPostFreelancerRouter
    .post("/freelancer/:id/:job" , createPostFreelancer)
    .get("/freelancer/:id" , getSpecificPostFreelancer)
module.exports = jobPostFreelancerRouter;

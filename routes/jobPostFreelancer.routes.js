const express = require('express');

const { authMiddleware } = require('../middleware/authMiddleware');

const { roleMiddleware } = require('../middleware/roleMiddleware');

const {createPostFreelancer}=require("../controllers/jobPostFreelancer.controller");

const jobPostFreelancerRouter = express.Router();

jobPostFreelancerRouter
    .post("/freelancer/:id/:job" , createPostFreelancer)
module.exports = jobPostFreelancerRouter;
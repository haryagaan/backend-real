const express = require('express');

const { authMiddleware } = require('../middleware/authMiddleware');

const { roleMiddleware } = require('../middleware/roleMiddleware');

const { 
    createJob, createJobAndPushToCategory, getJobs , getSpecificJob ,
    getSpecificJobClient , getSpecificJobFreelancer
} = require('../controllers/job.controller');

const jobRouter = express.Router();

jobRouter
    .post('/create', roleMiddleware(999), createJob)
    .post('/push/:category', roleMiddleware(999), createJobAndPushToCategory)
    .get("/get/:job" , getSpecificJob)
    .get("/get/client/:job" , getSpecificJobClient)
    .get("/get/freelancer/:job" , getSpecificJobFreelancer)
    .get('/get', getJobs);
module.exports = jobRouter;

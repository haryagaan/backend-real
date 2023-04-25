const express = require('express');

const { createJob, createJobAndPushToCategory, getJobs } = require('../controllers/job.controller');
const { roleMiddleware } = require('../middleware/roleMiddleware');

const jobRouter = express.Router();

jobRouter
    .post('/create', roleMiddleware(process.env.ADMIN), createJob)
    .post('/push', roleMiddleware(process.env.ADMIN), createJobAndPushToCategory)
    .get('/get', getJobs);
module.exports = jobRouter;

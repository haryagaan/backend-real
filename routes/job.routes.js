const express = require('express');

const { createJob, createJobAndPushToCategory, getJobs } = require('../controllers/job.controller');

const jobRouter = express.Router();

jobRouter.post('/create', createJob).post('/push/:category', createJobAndPushToCategory).get('/get', getJobs);
module.exports = jobRouter;

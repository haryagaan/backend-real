const express = require('express');

const adminJobRequestRouter = express.Router();

const { makeRequest , getRequests } = require('../controllers/adminJobRequest.controller');

adminJobRequestRouter.post('/request/job/:id/:category', makeRequest).get("/request/job/get",getRequests);
module.exports = adminJobRequestRouter;

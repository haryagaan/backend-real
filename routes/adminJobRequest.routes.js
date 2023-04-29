const express = require('express');

const adminJobRequestRouter = express.Router();

const {authMiddleware} =require("../middleware/authMiddleware");

const {roleMiddleware}=require("../middleware/roleMiddleware");

const { makeRequest, getRequests } = require('../controllers/adminJobRequest.controller');

adminJobRequestRouter.post('/request/job/:id/:category', authMiddleware ,  makeRequest).get('/request/job/get', roleMiddleware(999) , getRequests);
module.exports = adminJobRequestRouter;

const express = require('express');

const amdinRequestRouter = express.Router();

const { authMiddleware } = require('../middleware/authMiddleware');

const { roleMiddleware } = require('../middleware/roleMiddleware');

const { makeJobRequest , getJobRequests , getCategoryRequests , makeCategoryRequest } = require('../controllers/adminRequest.controller');

amdinRequestRouter
    .post('/request/job/:token/:category', makeJobRequest)
    .post("/request/category/:token",makeCategoryRequest)
    .get('/request/job/get', roleMiddleware(999), getJobRequests)
    .get("/request/category/get",roleMiddleware(999) , getCategoryRequests)
module.exports = amdinRequestRouter;

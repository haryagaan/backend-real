const express = require('express');

const { authMiddleware } = require('../middleware/authMiddleware');

const { roleMiddleware } = require('../middleware/roleMiddleware');

const {
    createPostClient,
    getSpecificPostClient
}=require("../controllers/jobPostClient.controller")

const jobPostClientRouter = express.Router();

jobPostClientRouter
    .post("/client/:id/:job" , createPostClient)
    .get("/client/:id",getSpecificPostClient)
module.exports = jobPostClientRouter;

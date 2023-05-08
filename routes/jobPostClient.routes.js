const express = require('express');

const { authMiddleware } = require('../middleware/authMiddleware');

const { roleMiddleware } = require('../middleware/roleMiddleware');

const {createPostClient}=require("../controllers/jobPostClient.controller")

const jobPostClientRouter = express.Router();

jobPostClientRouter
    .post("/client/:id/:job" , createPostClient)
module.exports = jobPostClientRouter;

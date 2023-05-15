const express = require('express');

const { authMiddleware } = require('../middleware/authMiddleware');

const { roleMiddleware } = require('../middleware/roleMiddleware');

const {
    createPostClient,
    getSpecificPostClient,
    LikeClientPost,
    DislikeClientPost,
}=require("../controllers/jobPostClient.controller")

const jobPostClientRouter = express.Router();

jobPostClientRouter
    .post("/client/:id/:job" , createPostClient)
    .post("/client/like/:id/:post" , LikeClientPost)
    .post("/client/dislike/:id/:post" , DislikeClientPost)
    .get("/client/:id/:post",getSpecificPostClient)
module.exports = jobPostClientRouter;

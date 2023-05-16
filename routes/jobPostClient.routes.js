const express = require('express');

const { authMiddleware } = require('../middleware/authMiddleware');

const { roleMiddleware } = require('../middleware/roleMiddleware');

const {
    createPostClient,
    getSpecificPostClient,
    LikeClientPost,
    DislikeClientPost,
    LikedOrDislikedClient
}=require("../controllers/jobPostClient.controller")

const jobPostClientRouter = express.Router();

jobPostClientRouter
    .post("/client/:id/:job" , createPostClient)
    .post("/client/like/:id/:post" , LikeClientPost)
    .post("/client/dislike/:id/:post" , DislikeClientPost)
    .get("/client/react/:id/:post", LikedOrDislikedClient)
    .get("/client/:post",getSpecificPostClient)
module.exports = jobPostClientRouter;

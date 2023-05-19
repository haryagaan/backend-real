const express = require('express');

const { authMiddleware } = require('../middleware/authMiddleware');

const { roleMiddleware } = require('../middleware/roleMiddleware');

const {
    createPostClient,
    getSpecificPostClient,
    LikeClientPost,
    DislikeClientPost,
    LikedOrDislikedClient,
    writeCommentClient,
    getCommentsClient
}=require("../controllers/jobPostClient.controller")

const jobPostClientRouter = express.Router();

jobPostClientRouter
    .post("/client/:id/:job" , createPostClient)
    .post("/client/like/:id/:post" , LikeClientPost)
    .post("/client/dislike/:id/:post" , DislikeClientPost)
    .post("/client/comment/:token/:post" , writeCommentClient)
    .get("/client/react/:id/:post", LikedOrDislikedClient)
    .get("/client/:post",getSpecificPostClient)
    .get("/client/comment/:post",getCommentsClient)
module.exports = jobPostClientRouter;

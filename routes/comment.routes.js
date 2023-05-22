const express = require('express');

const commentRouter = express.Router();

const {getReply , writeReply} = require('../controllers/comment.controller');

commentRouter
   .get("/get/:comment" , getReply)
   .post("/reply/:token/:comment" , writeReply)
module.exports = commentRouter;

const express = require('express');

const {authMiddleware} =require("../middleware/authMiddleware");

const {roleMiddleware}=require("../middleware/roleMiddleware");

const {
    createCategory,
    getSpecificCategory,
    getAllCategory,
    deleteCategory,
} = require('../controllers/jobCategory.controller');

const jobCategoryRouter = express.Router();

jobCategoryRouter
    .post('/create', roleMiddleware(999) ,  createCategory)
    .get('/get/:category', authMiddleware ,  getSpecificCategory)
    .get('/getall', authMiddleware ,  getAllCategory)
    .delete('/delete/:category', roleMiddleware(999) ,  deleteCategory);
module.exports = jobCategoryRouter;

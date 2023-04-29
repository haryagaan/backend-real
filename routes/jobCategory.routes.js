const express = require('express');

const {
    createCategory,
    getSpecificCategory,
    getAllCategory,
    deleteCategory,
} = require('../controllers/jobCategory.controller');

const jobCategoryRouter = express.Router();

jobCategoryRouter
    .post('/create', createCategory)
    .get('/get', getSpecificCategory)
    .get('/getall', getAllCategory)
    .delete('/delete', deleteCategory);
module.exports = jobCategoryRouter;

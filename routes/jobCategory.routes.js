const express = require('express');

const {
    createCategory,
    getSpecificCategory,
    getAllCategory,
    deleteCategory,
} = require('../controllers/jobCategory.controller');
const { authMiddleware } = require('../middleware/authMiddleware');
const { roleMiddleware } = require('../middleware/roleMiddleware');

const jobCategoryRouter = express.Router();

jobCategoryRouter
    .post('/create', roleMiddleware(process.env.ADMIN), createCategory)
    .get('/get', getSpecificCategory)
    .get('/getall', getAllCategory)
    .delete('/delete', roleMiddleware(process.env.ADMIN), deleteCategory);
module.exports = jobCategoryRouter;

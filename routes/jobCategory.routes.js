const express = require("express");

const {
    createCategory,
    getSpecificCategory
} = require("../controllers/jobCategory.controller");

const jobCategoryRouter = express.Router();

jobCategoryRouter
    .post("/create" , createCategory)
    .get("/get",getSpecificCategory)
module.exports = jobCategoryRouter;
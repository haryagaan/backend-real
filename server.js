const express = require('express');

const mongoose = require('mongoose');

const cors = require('cors');

require('dotenv').config();

const app = express();

const connect = require('./mongoDb/db.connector');

const port = process.env.PORT || 8080;

mongoose.set('strictQuery', false);

connect();

//routers

const authRouter = require('./routes/auth.routes');

const emailRouter = require('./routes/email.routes');

const authSocialRouter = require('./routes/auth-social.routes');

const userRouter = require('./routes/user.routes');

const jobRouter = require('./routes/job.routes');

const jobCategoryRouter = require('./routes/jobCategory.routes');

const adminJobRequestRouter = require('./routes/adminJobRequest.routes');

const jobPostClientRouter=require("./routes/jobPostClient.routes");

const jobPostFreelancerRouter=require("./routes/jobPostFreelancer.routes")


const { authMiddleware } = require('./middleware/authMiddleware');

const {decodeToken}=require("./decode/decode")

//

app.use(express.json());

app.use(cors());

//routers

app.use('/auth/', authRouter, authSocialRouter);

app.use('/email/', emailRouter);

app.use('/user/', authMiddleware, userRouter);

app.use('/job/', authMiddleware, jobRouter);

app.use('/category/', authMiddleware, jobCategoryRouter);

app.use('/admin/', authMiddleware, adminJobRequestRouter);

app.use('/post/', authMiddleware, jobPostClientRouter , jobPostFreelancerRouter);

app.post("/decode/", decodeToken)

//

app.listen(port, () => {
    console.log('Server listening at :', port);
});

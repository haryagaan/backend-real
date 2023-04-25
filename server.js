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

//

app.use(express.json());

app.use(cors());

//routers

app.use('/auth/', authRouter, authSocialRouter);

app.use('/email/', emailRouter);

app.use('/user/', userRouter);

app.use('/job/', jobRouter);

app.use('/category/', jobCategoryRouter);

//

app.listen(port, () => {
    console.log('Server listening at :', port);
});

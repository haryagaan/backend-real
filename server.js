const express = require('express');

const mongoose = require('mongoose');

const cors = require('cors');

const multer=require("multer");

const bodyParser = require('body-parser');

const path=require("path");

const fs=require("fs");

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

const adminRequestRouter = require('./routes/adminRequest.routes');

const jobPostClientRouter=require("./routes/jobPostClient.routes");

const jobPostFreelancerRouter=require("./routes/jobPostFreelancer.routes")


const { authMiddleware } = require('./middleware/authMiddleware');

const {decodeToken}=require("./decode/decode")

//

// app.use(express.json());

app.use(express.json({limit: '100mb'}));

app.use(express.urlencoded({limit: '100mb'}));

app.use(cors());

//routers

app.use('/auth/', authRouter, authSocialRouter);

app.use('/email/', emailRouter);

app.use('/user/', authMiddleware, userRouter);

app.use('/job/', authMiddleware, jobRouter);

app.use('/category/', authMiddleware, jobCategoryRouter);

app.use('/admin/', authMiddleware, adminRequestRouter);

app.use('/post/', authMiddleware, jobPostClientRouter , jobPostFreelancerRouter);

app.post("/decode/", decodeToken);

//multer

// const {Images}=require("./models/image.module");

// const fileStorageEngine=multer.diskStorage({
//     destination:(req,file,cb)=>{
//         cb(null, path.join(__dirname, 'images'))
//     },

//     filename:(req,file,cb)=>{
//         // cb(null, `${Date.now()}_${file.originalname}`)
//         cb(null, file.originalname)
//     }
// });

// const upload=multer({
//     storage:fileStorageEngine,
//     // limits: { fileSize: maxSize }
// });

// app.post("/single", upload.single("image") , async(req,res)=>{
//     const image=await Images.create({
//         name:req.body.name,

//         img:{
//             data:fs.readFileSync(path.join(__dirname, 'images/') + req.file.filename),
//             contentType:"image/png"
//         }
//     });
//     res.send(image);
// })

// app.get("/images",async(req,res)=>{
//     const images=await Images.find({});

//     res.json(images)
// })

//

app.listen(port, () => {
    console.log('Server listening at :', port);
});

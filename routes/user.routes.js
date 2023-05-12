const { Router } = require('express');


const {
    getUser,
    getUsers,
    createRole,
    deleteUser,
    forgotPassword,
    resetPassword,
    setProfileImage,
    returnIdFromToken,
    setGalleryImage,
    changeUserInfo
} = require('../controllers/user.controller');

const { roleMiddleware } = require('../middleware/roleMiddleware');

const userRouter = Router();

userRouter
    .get('/', getUsers)
    .get('/:id', getUser)
    .post('/', roleMiddleware(999), createRole)
    .post('/forgot/password/:id', forgotPassword)
    .post('/reset/password/:id', resetPassword)
    .post("/image/profile/:token" , setProfileImage)
    .post("/image/gallery/:token" , setGalleryImage)
    .post("/change/info/:token" ,changeUserInfo)
    .post("/return/id/:token" , returnIdFromToken)
    .delete('/:id', roleMiddleware(999), deleteUser);

module.exports = userRouter;

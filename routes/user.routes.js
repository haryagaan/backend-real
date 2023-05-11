const { Router } = require('express');


const {
    getUser,
    getUsers,
    createRole,
    deleteUser,
    forgotPassword,
    resetPassword,
    setProfileImage
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
    .delete('/:id', roleMiddleware(999), deleteUser);

module.exports = userRouter;

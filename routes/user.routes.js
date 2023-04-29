const { Router } = require('express');

const { getUser, getUsers, createRole, deleteUser } = require('../controllers/user.controller');

const { roleMiddleware } = require('../middleware/roleMiddleware');

const { authMiddleware } = require('../middleware/authMiddleware');

const userRouter = Router();

userRouter
    .get('/', getUsers)
    .get('/:id', getUser)
    .post('/', roleMiddleware(999), createRole)
    .delete('/:id', roleMiddleware(999), deleteUser);

module.exports = userRouter;

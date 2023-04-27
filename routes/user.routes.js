const { Router } = require('express');
const { getUser, getUsers, createRole, deleteUser } = require('../controllers/user.controller');
const { authMiddleware } = require('../middleware/authMiddleware');
const { roleMiddleware } = require('../middleware/roleMiddleware');

const userRouter = Router();

userRouter
    .get('/', getUsers)
    .get('/:id', getUser)
    .post('/:id', roleMiddleware(999), createRole)
    .delete('/:id', deleteUser);

module.exports = userRouter;

const { Router } = require('express');
const { getUser, getUsers, createRole } = require('../controllers/user.controller');

const userRouter = Router();

userRouter.get('/', getUsers).get('/:id', getUser).post('/:id', createRole);

module.exports = userRouter;

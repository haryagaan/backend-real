const { Router } = require('express');
const { getUser, getUsers, createRole } = require('../controllers/user.controller');
const { authMiddleware } = require('../middleware/authMiddleware');
const { roleMiddleware } = require('../middleware/roleMiddleware');

const userRouter = Router();

userRouter.get('/', getUsers).get('/:id', getUser).post('/:id', roleMiddleware(process.env.ADMIN), createRole);

module.exports = userRouter;

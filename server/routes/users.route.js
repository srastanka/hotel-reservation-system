const express = require('express');
const User = require('../controller/user');
const userRouter = express.Router();

userRouter.post('/setUser', User.userMiddleware);

module.exports = userRouter;

const express = require('express');
const bookingRouter = express.Router();
const BookingController = require('../controller/booking');
const UserController = require('../controller/user');


bookingRouter.post('/add', UserController.userMiddleware, BookingController.createBooking);

bookingRouter.get('', UserController.userMiddleware, BookingController.getUserBookings );

bookingRouter.delete('/cancel/:id', UserController.userMiddleware, BookingController.cancelBooking);

module.exports = bookingRouter;

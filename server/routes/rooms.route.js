const express = require('express');
const roomRouter = express.Router();
const RoomController = require('../controller/room');

roomRouter.get('', RoomController.getRooms);

roomRouter.post('/available', RoomController.getAvailableRooms);

module.exports = roomRouter;

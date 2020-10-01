const moment = require('moment');
const Room = require('../model/room.model');
const Booking = require('../model/booking.model');
const util = require('./controllerUtil');
const { normalizeErrors } = require('../helper/util');

exports.getRooms = function (req, res) {

  Room.find({}, 'name bookings', function (err, foundRooms) {
    if (err) {
      return res.status(422).send({ errors: normalizeErrors(err.errors) });
    }

    if (foundRooms.length === 0) {
      return res.status(404).send('There are no rooms in the system');
    }
    return res.json(foundRooms);
  });
};

exports.getAvailableRooms = function (req, res) {
  const startDate = moment.utc(req.body.checkin).local().format('MM-DD-YYYY');
  const endDate = moment.utc(req.body.checkout).local().format('MM-DD-YYYY');
  const booking = new Booking({ startDate, endDate });

  Room.find({}).populate('bookings').exec(function (err, foundRooms) {
    if (err) {
      return res.status(422).send({ errors: normalizeErrors(err.errors) });
    }

    if (foundRooms.length === 0) {
      return res.status(404).send('There are no rooms in the system');
    }

    let roomsList = [];

    foundRooms.forEach( room => {
      if (util.isValidBooking(booking, room)) {
        roomsList.push(room);
      }
    });
    if(roomsList.length) {
      return res.json(roomsList);
    } else {
      return res.status(404).send('There are no rooms in the system');
    }
  });
};

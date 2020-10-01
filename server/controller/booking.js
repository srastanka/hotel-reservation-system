const moment = require('moment');
const Booking = require('../model/booking.model');
const Room = require('../model/room.model');
const User = require('../model/user.model');
const { normalizeErrors } = require('../helper/util');
const util = require('./controllerUtil');


exports.createBooking = function(req, res) {
  const { room, roomid } = req.body;
  const user = res.locals.user;

  const startDate = moment.utc(req.body.checkin).local().format('MM-DD-YYYY');
  const endDate = moment.utc(req.body.checkout).local().format('MM-DD-YYYY');

  const booking = new Booking({ startDate, endDate });

  Room.findById(roomid).populate('bookings').exec(function(err, foundRoom) {
    if (err) {
      return res.status(422).send({errors: normalizeErrors(err.errors)});
    }

    if (util.isValidBooking(booking, foundRoom)) {
      booking.user = user.username;
      booking.room = foundRoom.name;
      booking.roomid = roomid;
      foundRoom.bookings.push(booking);

      booking.save(function(err) {
        if (err) {
          return res.status(422).send({errors: normalizeErrors(err.errors)});
        }

        foundRoom.save();
        User.findOne({ username: user.username}, function(err, foundUser) {
          if (err || !foundUser) {
            // create user
            foundUser = new User({ username: user.username });
            foundUser.bookings.push(booking);
            foundUser.save(function(err) {
              if (err) {
                return res.status(422).send({errors: normalizeErrors(err.errors)});
              }
            });
          } else {
            User.updateOne({_id: foundUser.id}, {$push: {bookings: booking}}, function () {
            });
          }
        });

        return res.json({startDate: booking.startDate, endDate: booking.endDate});
      });
    } else {
      return res.status(422).send('Cannot book this reservation. Chosen dates are already taken. Please select another date or room.');
    }
  })
}

exports.getUserBookings = function(req, res) {
  const user = res.locals.user;

  User.findOne({ username: user.username}).populate('bookings').exec(function(err, foundUser) {
    if (err) {
      return res.status(422).send({errors: normalizeErrors(err.errors)});
    }
    if(foundUser) {
      return res.json(foundUser.bookings);
    } else {
      res.status(200).send([]);
    }
  });
}

exports.cancelBooking = function(req, res) {
  Booking.findByIdAndRemove({_id: req.params.id}, function(err, booking){
    if(err) res.json(err);
    else res.json('Successfully cancelled.');
  });

}

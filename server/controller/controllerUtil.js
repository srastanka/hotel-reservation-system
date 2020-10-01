const moment = require('moment');

exports.isValidBooking = function (proposedBooking, room) {
  let isValid = true;

  if (room.bookings && room.bookings.length > 0) {

    isValid = room.bookings.every(function(booking) {
      const proposedStart = moment(proposedBooking.startDate);
      const proposedEnd = moment(proposedBooking.endDate);

      const actualStart = moment(booking.startDate);
      const actualEnd = moment(booking.endDate);

      return ((actualStart < proposedStart && actualEnd <= proposedStart) || (proposedEnd < actualEnd && proposedEnd <= actualStart));
    });
  }

  return isValid;
}

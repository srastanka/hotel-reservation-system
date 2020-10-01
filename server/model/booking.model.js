const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const bookingSchema = new Schema({
  endDate: {type: Date, required: 'Ending Date is required!'},
  startDate: {type: Date, required: 'Start Date is required!'},
  createdAt: {type: Date, default: Date.now},
  user: {type: String},
  room: {type: String},
  roomid: {type: String}
});

module.exports = mongoose.model('Booking', bookingSchema);

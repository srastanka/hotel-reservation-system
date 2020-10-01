const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define collection and schema for a room
let roomSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  bookings: [{type: Schema.Types.ObjectId, ref: 'Booking'}]
},{
    collection: 'room'
});

module.exports = mongoose.model('Room', roomSchema);

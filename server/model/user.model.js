const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        min: [4, 'Too short, min is 4 characters'],
        max: [32, 'Too long, max is 32 characters']
    },
    bookings: [{type: Schema.Types.ObjectId, ref: 'Booking'}]
});

module.exports = mongoose.model('User', userSchema);

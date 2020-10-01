const Room = require('./model/room.model');
const User = require('./model/user.model');
const Booking = require('./model/booking.model');
const dbStartupData = require('./data.json');

class DBStartup {
  constructor() {
    this.rooms = dbStartupData.rooms;
  }

  async cleanDb() {
    await User.deleteMany({});
    await Room.deleteMany({});
    await Booking.deleteMany({});
  }

  pushDataToDb() {
    this.rooms.forEach((room) => {
      const newRental = new Room(room);
      newRental.save();
    });
  }

  async seedDb() {
    await this.cleanDb();
    this.pushDataToDb();
  }
}

module.exports = DBStartup;

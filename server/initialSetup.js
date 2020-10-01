const mongoose = require('mongoose');
const config = require('./DB.js');
const DBStartup = require('./db-startup');

mongoose.Promise = global.Promise;
mongoose.connect(config.DB, { useNewUrlParser: true }).then(
  async () => {
    console.log('Database is connected. Seeding DB.');
    const dbstartup = new DBStartup();
    dbstartup.seedDb();
    // we should promisify the functions so that connection is closed after db is seeded
    await sleep(2000);
    mongoose.connection.close();
  },
  err => { console.error('Error connecting to the database : '+ err)}
);

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const express = require('express')
const bodyParser = require('body-parser')

// ensure that the "proxy" entry in package.json
// matches this for development
const PORT = process.env.EXPRESS_PORT || 1337
const app = express()
const cors = require('cors');
const mongoose = require('mongoose');
const config = require('./DB.js');
const DBStartup = require('./db-startup');
const bookingRoute = require('./routes/booking.route');
const roomsRoute = require('./routes/rooms.route');
const usersRoute = require('./routes/users.route');

mongoose.Promise = global.Promise;
mongoose.connect(config.DB, { useNewUrlParser: true }).then(
  () => {
    console.log('Database is connected');
    // const dbstartup = new DBStartup();
    // dbstartup.seedDb();
    },
  err => { console.error('Error connecting to the database : '+ err)}
);

app.use(cors());
app.use(bodyParser.json())
app.get('/healthcheck', (req, res) => res.send('Healthy'))


/*
 * Your application logic here...
 */

 app.use('/booking', bookingRoute);
 app.use('/room', roomsRoute);
 app.use('/user', usersRoute);

if (module === require.main) {
  app.listen(PORT, () => {
    console.log(`Application listening at ${PORT}`)
  })
}

module.exports = app

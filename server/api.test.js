const request = require('supertest');
const server = require('./index');
const mongoose = require('mongoose');

// if you run npm run test:server, make sure the server is stopped
describe('index', () => {
  afterAll( async () =>{
    await mongoose.connection.close()
  })
  it('responds to healthcheck', () => {
    return request(server)
      .get('/healthcheck')
      .expect(200, /Healthy/);
  })
})

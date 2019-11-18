const request = require('supertest');
const app = require('../index.js');

describe("search", function(done) {
  it("returns json list of businesses based on long and lat", function(done) {
    request(app).get("/search/?long=-122.335167&lat=47.608013&radius=8000")
      .expect(200)
      .expect(function(res) {
        res.body.businesses[0].id = "6I28wDuMBR5WLMqfKxaoeg";
      })
      .expect('Content-Type', /json/, done)
  });
})

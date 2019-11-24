const request = require('supertest');
const app = require('../index.js');
const assert = require('chai').assert;
const resultsNumber = 5;
const longitude =  -122.335167;
const latitude = 47.608013;
const searchTerm = "food";
const radius = 8000;

describe("search", function(done) {
  it("returns json list of businesses based on long and lat", function() {
    return request(app).get(`/places/?long=${longitude}&lat=${latitude}&radius=${radius}&term=${searchTerm}&limit=${resultsNumber}`)
      .expect(200)
      .expect(function(res) {
        assert.equal(res.body.businesses.length, resultsNumber)
        res.body.businesses.forEach((business) => {
          assert.isString(business.id)
          assert.isString(business.name)
          assert.isString(business.yelp_url)
          assert.isArray(business.hours)
          assert.lengthOf(business.photos, 3);
        })
      })
  });
})

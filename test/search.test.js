const request = require('supertest');
const app = require('../index.js');
const assert = require('chai').assert;
const expect = require('chai').expect;
const resultsNumber = 5;

describe("search", function(done) {
  it("returns json list of businesses based on long and lat", function() {
    return request(app).get(`/search/?long=-122.335167&lat=47.608013&radius=8000&term=food&limit=${resultsNumber}`)
      .expect(200)
      .expect(function(res) {
        assert.equal(res.body.businesses.length, resultsNumber)
        res.body.businesses.forEach((business) => {
          assert.isString(business.id)
          assert.isString(business.name)
          assert.isString(business.yelp_url)
          assert.isArray(business.hours)
          expect(business.photos).to.have.lengthOf(3)
        })
      })
  });
})

'use strict';
const express = require('express');
const router = express.Router();

const yelp = require('yelp-fusion');
const API_key = 'r1vbEMtp8IBHtXAGam3bzbj7UTc3yEfmd6tRnfcc7L14ezrh-HlwjfSAefD6pNYa1vPHGKyPHvXL4uSIapALyPuvTE9PXCEYpofz4nnNj7YXNJZTYyyaLPanDB7OXXYx'
const client = yelp.client(API_key);

router.get('/', async (req, res) => {
  try {
    if(req.query.long === undefined || req.query.lat === undefined) {
      throw new Error('Error: Longitude and Latitude required');
    }
    client.search({
      term: 'food',
      latitude: req.query.lat,
      longitude: req.query.long,
      radius: req.query.radius,
      limit: req.query.limit,
      offset: req.query.offset,
    })
      .then(yelpResponse => {
        transformRestaurants(yelpResponse.jsonBody.businesses)
          .then(restaurants => {
            res.status(200).json({
              businesses: restaurants,
            });
          });
      }).catch(e => {
        res.status(400).json(e);
      });
  } catch (err) {
    res.status(400).json({message: err.message});
  }
});

router.get('/yelp', async (req, res) => {
  try {
    client.businessMatch({
      name: req.query.name,
      address1: req.query.address,
      city: req.query.city,
      state: req.query.state,
      country: 'US',
      phone: req.query.phone,
      latitude: req.query.lat,
      longitude: req.query.lng,
    })
      .then(yelpResponse => {
        console.log(yelpResponse.jsonBody.businesses);
        if(yelpResponse.jsonBody.businesses.length === 0) {
          return null
        }
        transformRestaurants(yelpResponse.jsonBody.businesses)
          .then(yelpTransformed => {
            console.log(yelpTransformed);
            res.status(200).json({businessInfo: yelpTransformed})
          })
      }).catch(e => {
        res.status(400).json(e);
      });
  } catch (err) {
    res.status(400).json({message: err.message});
  }
});

function transformRestaurants(yelpRestaurants) {
  const businessRequests = yelpRestaurants.map((restaurant) => {
    return client.business(restaurant.id)
      .then(response => {
        return {
          id: response.jsonBody.id,
          name: response.jsonBody.name,
          yelp_url: response.jsonBody.url,
          photos: response.jsonBody.photos,
          hours: response.jsonBody.hours,
          coordinates: response.jsonBody.coordinates,
        };
      }).catch(e => {
        console.log(e);
      });
  })
  return Promise.all(businessRequests)
}

module.exports = router;

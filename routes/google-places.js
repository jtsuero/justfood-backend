require('dotenv/config');
const express = require('express');
const router = express.Router();
const client = require('@google/maps').createClient({
  key: process.env.API_KEY,
  Promise: Promise,
});

router.get('/', async (req, res) => {
  try {
    if (req.query.long === undefined || req.query.lat === undefined) {
      throw new Error('Error: Longitude and Latitude required');
    }
    return client
      .placesNearby({
        language: 'en',
        location: [req.query.lat, req.query.long],
        radius: parseInt(req.query.radius),
        opennow: true,
        keyword: req.query.keyword,
        type: 'restaurant',
      })
      .asPromise()
      .then(googleResponse => {
        transformRestaurants(googleResponse.json.results).then(restaurants =>
          res.json({businesses: restaurants}),
        );
      })
      .catch(e => res.status(400).json({message: e.message}));
  } catch (err) {
    res.status(400).json({message: err.message});
  }
});

router.get('/place', async (req, res) => {
  try {
    if (req.query.businessId === undefined) {
      throw new Error('Error: No Such Business Exists');
    }
    return client
      .place({
        placeid: req.query.businessId,
        language: 'en',
      })
      .asPromise()
      .then(googleResponse => {
        let photoUrlArray = getBusinessPhotos(googleResponse);
        googleResponse.json.result.photos = photoUrlArray;
        res.json({business: googleResponse});
      })
      .catch(e => res.status(400).json({message: e.message}));
  } catch (err) {
    res.status(400).json({message: err.message});
  }
});

function getBusinessPhotos(business) {
  if (business.json.result.photos) {
    const businessPhotos = business.json.result.photos.map(photoProp => {
      return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photoProp.photo_reference}&key=${process.env.API_KEY}`;
    });
    return businessPhotos;
  }
}

function transformRestaurants(openRestaurants) {
  const businessRequests = openRestaurants.map(restaurant => {
    return client
      .place({
        placeid: restaurant.place_id,
        language: 'en',
      })
      .asPromise()
      .then(restaurant => {
        return {
          id: restaurant.json.result.place_id,
          address: restaurant.json.result.formatted_address,
          phone: restaurant.json.result.formatted_phone_number,
          int_phone: restaurant.json.result.international_phone_number,
          hours: restaurant.json.result.opening_hours.weekday_text,
          name: restaurant.json.result.name,
          photos: getBusinessPhotos(restaurant),
          open_now: restaurant.json.result.opening_hours.open_now,
          coordinates: restaurant.json.result.geometry.location,
          website: restaurant.json.result.website,
        };
      })
      .catch(e => console.log({message: e.message}));
  });
  return Promise.all(businessRequests);
}

module.exports = router;

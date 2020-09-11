require('dotenv/config');
const express = require('express');
const router = express.Router();
const axios = require('axios');
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
        opennow: req.query.open === 'true',
        keyword: req.query.keyword,
        type: 'restaurant',
      })
      .asPromise()
      .then(googleResponse => {
        transformRestaurants(googleResponse.json.results, {
          lat: req.query.lat,
          long: req.query.long,
        }).then(restaurants => res.json({businesses: restaurants}));
      })
      .catch(e => res.status(400).json({message: e}));
  } catch (err) {
    res.status(400).json({message: err});
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
      .catch(e => res.status(400).json({message: e}));
  } catch (err) {
    res.status(400).json({message: err});
  }
});

router.get('/geocode', async (req, res) => {
  try {
    return client
      .geocode({
        address: req.query.address,
      })
      .asPromise()
      .then(googleResponse => {
        res.json(googleResponse.json.results);
      })
      .catch(e => res.status(400).json({message: e}));
  } catch (err) {
    res.status(400).json({message: err});
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

function transformRestaurants(openRestaurants, location) {
  const businessRequests = openRestaurants.map(restaurant => {
    return client
      .place({
        placeid: restaurant.place_id,
        language: 'en',
      })
      .asPromise()
      .then(async restaurant => {
        let r = restaurant.json.result;
        return {
          id: r.place_id,
          address: r.formatted_address,
          phone: r.formatted_phone_number,
          int_phone: r.international_phone_number,
          hours: r.opening_hours ? r.opening_hours.weekday_text : null,
          name: r.name,
          distance: await getDistance(r.geometry.location, location),
          photos: getBusinessPhotos(restaurant),
          coordinates: r.geometry ? r.geometry.location : null,
          website: r.website,
        };
      })
      .catch(e => console.log({message: e}));
  });
  return Promise.all(businessRequests);
}

async function getDistance(restaurantLocation, location) {
  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=${location.lat},${location.long}&destinations=${restaurantLocation.lat}%2C${restaurantLocation.lng}&key=${process.env.API_KEY}`,
    );
    return response.data.rows[0].elements;
  } catch (error) {
    console.error(error);
  }
}

module.exports = router;

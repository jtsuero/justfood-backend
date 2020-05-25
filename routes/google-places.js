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
      .catch(e => console.log(e));
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
        res.json({business: googleResponse});
      })
      .catch(e => console.log(e));
  } catch (err) {
    res.status(400).json({message: err.message});
  }
});

router.get('/photos', async (req, res) => {
  try {
    return client
      .placesPhoto({
        photoreference: req.query.photoreference,
        maxwidth: 400,
        maxheight: 400,
      })
      .asPromise()
      .then(photo => {
        let photoURL = 'https://' + photo.req.socket._host + photo.req.path;
        res.send(photoURL);
      })
      .catch(e => console.log(e));
  } catch (err) {
    res.status(400).json({message: err.message});
  }
});

function transformRestaurants(openRestaurants) {
  const businessRequests = openRestaurants.map(restaurant => {
    return client
      .place({
        placeid: restaurant.place_id,
        language: 'en',
      })
      .asPromise()
      .then(restaurants => {
        return {
          id: restaurants.json.result.place_id,
          address: restaurants.json.result.formatted_address,
          phone: restaurants.json.result.formatted_phone_number,
          int_phone: restaurants.json.result.international_phone_number,
          hours: restaurants.json.result.opening_hours.weekday_text,
          name: restaurants.json.result.name,
          photos: restaurants.json.result.photos,
          open_now: restaurants.json.result.opening_hours.open_now,
          coordinates: restaurants.json.result.geometry.location,
          website: restaurants.json.result.website,
        };
      })
      .catch(e => {
        console.log(e);
      });
  });
  return Promise.all(businessRequests);
}

function getPhotoLinks(restaurants) {
  const photoLinks = restaurants.json.result.photos.map(photo => {
    return client
      .placesPhoto({
        photoreference: photo.photo_reference,
        maxwidth: 400,
        maxheight: 400,
      })
      .asPromise()
      .then(photo => {
        let photoURL = 'https://' + photo.req.socket._host + photo.req.path;
        return (restaurants.json.result.photos.photo_reference = photoURL);
      })
      .catch(e => console.log(e));
  });
}

module.exports = router;

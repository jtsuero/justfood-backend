require('dotenv/config');
const express = require('express');
const router = express.Router();
const client = require('@google/maps').createClient({
  key: process.env.API_KEY,
	Promise: Promise,
});

router.get('/', async (req, res) => {
	try {
		if(req.query.long === undefined || req.query.lat === undefined) {
			throw new Error('Error: Longitude and Latitude required');
		}
		return client.placesNearby({
			language: 'en',
			location: [req.query.lat, req.query.long],
			radius: 5000,
			opennow: true,
			type: 'restaurant',
		})
		.asPromise()
    .then((googleResponse) => {
      transformRestaurants(googleResponse.json.results)
        .then(restaurants => res.json({businesses: restaurants}))
    })
		.catch(e => console.log(e));
	} catch (err) {
		res.status(400).json({message: err.message});
	}
});

function transformRestaurants(openRestaurants) {
  const businessRequests = openRestaurants.map((restaurant) => {
    return client.place({
      placeid: restaurant.place_id,
      language: 'en',
    })
      .asPromise()
      .then(restaurants => {
        return {
          id: restaurants.json.result.place_id,
          phone: restaurants.json.result.formatted_phone_number,
          hours: restaurants.json.result.opening_hours.weekday_text,
          name: restaurants.json.result.name,
          photos: restaurants.json.result.photos,
          open_now: restaurants.json.result.opening_hours.open_now,
          coordinates: restaurants.json.result.geometry.location,
          website: restaurants.json.result.website,
          // restaurants: restaurants,
        };
      })
      .catch(e => {
        console.log(e);
      });
  })
  return Promise.all(businessRequests)
}

module.exports = router;

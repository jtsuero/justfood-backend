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
      // res.json(googleResponse.json.results)
      transformRestaurants(googleResponse.json.results)
        .then(restaurants => res.json({businesses: restaurants}))
// res.json(googleResponse.json.results[0].place_id)
    })
		.catch(e => console.log(e));
	} catch (err) {
		res.status(400).json({message: err.message});
	}
});

// router.get('/photos', async (req, res) => {
// 	try {
// 		if(req.query.long === undefined || req.query.lat === undefined) {
// 			throw new Error('Error: Longitude and Latitude required');
// 		}
// 		return client.placesNearby({
// 			language: 'en',
// 			location: [req.query.lat, req.query.long],
// 			radius: 5000,
// 			opennow: true,
// 			type: 'restaurant',
// 		})
// 		.asPromise()
//     .then((googleResponse) => {
//       // res.json(googleResponse.json.results)
//       transformRestaurants(googleResponse.json.results)
//         .then(restaurants => res.json({businesses: restaurants}))
// // res.json(googleResponse.json.results[0].place_id)
//     })
// 		.catch(e => console.log(e));
// 	} catch (err) {
// 		res.status(400).json({message: err.message});
// 	}
// });

function transformRestaurants(openRestaurants) {
  const businessRequests = openRestaurants.map((restaurant) => {
    // console.log(restaurant)
    return client.place({
      placeid: restaurant.place_id,
      language: 'en',
    })
      .asPromise()
      .then(restaurants => {
        console.log(restaurants);
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

// getPhotos = (place) => {
//   console.log(place.photo_reference);
//   const photos = place.photo_reference.map((photo) => {
//     client.placesPhoto({
//       photoreference: photo,
//       maxwidth: 100,
//       maxheight: 100,
//     }).asPromise()
//       .then((response) => {
//       console.log(response)
//       // return {
//       //     id: restaurants.json.result.place_id,
//       //     name: restaurants.json.result.name,
//       //     photos: restaurants.json.result.photos,
//       //     hours: restaurants.json.result.hours,
//       //     coordinates: restaurants.json.result.geometry.location,
//       // }
//     })
//       .catch(err => console.log(err));
//   })
//   return Promise.all(photos);
//
// }

module.exports = router;

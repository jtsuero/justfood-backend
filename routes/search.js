const express = require('express'); //these needed?
const router = express.Router();

const yelp = require('yelp-fusion');
const API_key = 'r1vbEMtp8IBHtXAGam3bzbj7UTc3yEfmd6tRnfcc7L14ezrh-HlwjfSAefD6pNYa1vPHGKyPHvXL4uSIapALyPuvTE9PXCEYpofz4nnNj7YXNJZTYyyaLPanDB7OXXYx'
const client = yelp.client(API_key);

router.get('/', async (req, res) => {
  try {
    client.search({
      latitude: '47.608013',
      longitude: '-122.335167', //seattle long and lat in degrees and minutes
      radius: 8000 //search is in meters
    }).then(response => {
      console.log(response.jsonBody.businesses);
      console.log(response.jsonBody.businesses.length);
    }).catch(e => {
      console.log(e);
    });

  } catch (err) {
    res.status(400).json({message: err});
  }
  });

module.exports = router;

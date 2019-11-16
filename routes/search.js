const express = require('express');
const router = express.Router();

const yelp = require('yelp-fusion');
const API_key = 'r1vbEMtp8IBHtXAGam3bzbj7UTc3yEfmd6tRnfcc7L14ezrh-HlwjfSAefD6pNYa1vPHGKyPHvXL4uSIapALyPuvTE9PXCEYpofz4nnNj7YXNJZTYyyaLPanDB7OXXYx'
const client = yelp.client(API_key);

router.get('/', async (req, res) => {
  try {
    client.search({
      latitude: req.query.lat,
      longitude: req.query.long,
      radius: req.query.radius
    }).then(restaurants => {
      res.status(200).json(restaurants);
    }).catch(e => {
      res.status(400).json(e);
    });

  } catch (err) {
    res.status(400).json({message: err});
  }
  });

module.exports = router;

const express = require('express');
const app = express();
const yelp = require('yelp-fusion');
const API_key = 'r1vbEMtp8IBHtXAGam3bzbj7UTc3yEfmd6tRnfcc7L14ezrh-HlwjfSAefD6pNYa1vPHGKyPHvXL4uSIapALyPuvTE9PXCEYpofz4nnNj7YXNJZTYyyaLPanDB7OXXYx';
const client = yelp.client(API_key);


// client.business('gary-danko-san-francisco').then(response => {
//   console.log(response.jsonBody.photos);
// }).catch(e => {
//   console.log(e);
// });

client.search({
  // term: 'Four Barrel Coffee',
  // location: 'san francisco, ca',
    latitude: '47.608013',
    longitude: '-122.335167', //seattle long and lat in degrees and minutes
    radius: 8000 //search is in meters
}).then(response => {
  console.log(response.jsonBody.businesses);
  console.log(response.jsonBody.businesses.length); //prints out twenty restaurants as default
}).catch(e => {
  console.log(e);
});

app.listen(3000, () => console.log('Server up and running'));

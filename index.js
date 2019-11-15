const express = require('express');
const app = express();
const yelp = require('yelp-fusion');
const API_key = r1vbEMtp8IBHtXAGam3bzbj7UTc3yEfmd6tRnfcc7L14ezrh-HlwjfSAefD6pNYa1vPHGKyPHvXL4uSIapALyPuvTE9PXCEYpofz4nnNj7YXNJZTYyyaLPanDB7OXXYx;
const client = yelp.client(API_key);

app.listen(3000, () => console.log('Server up and running'));

const express = require('express');
const app = express();

//Import Routes
const placesRoute = require('./routes/places');

//Routes
app.use('/places', placesRoute);

app.listen(3000, () => console.log('Server up and running'));

module.exports = app;

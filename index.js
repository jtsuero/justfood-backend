const express = require('express');
const app = express();

//Import Routes
const searchRoute = require('./routes/search');

//Routes
app.use('/search', searchRoute);

app.listen(3000, () => console.log('Server up and running'));

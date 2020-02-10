const express = require('express');
const app = express();
const cors = require('cors');
const PORT = 8000;

//Import Routes
const placesRoute = require('./routes/places');
const googleRoute = require('./routes/google-places');

app.use(cors({origin:'http://localhost:3000'}));
app.use('/places', placesRoute);
app.use('/restaurants', googleRoute);

app.listen(PORT, () => console.log(`Server up and running on ${PORT}`));

module.exports = app;

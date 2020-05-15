require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const PORT = process.env.PORT || 8000;
const corsEnvironment =
  process.env.NODE_ENV === 'production'
    ? 'http://justfood.me'
    : 'http://localhost:3000';

//Import Routes
const placesRoute = require('./routes/places');
const googleRoute = require('./routes/google-places');

app.use(cors({origin: corsEnvironment}));
app.use('/', (req, res) => {
  res.sendStatus(200);
});
app.use('/places', placesRoute);
app.use('/restaurants', googleRoute);

app.listen(PORT, () => console.log(`Server up and running on ${PORT}`));

module.exports = app;

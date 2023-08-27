const express = require('express');
const cors = require('cors');
const config = require('./config');
const routes = require('./routes');

const app = express();
app.use(cors({
  origin: '*',
}));

// We use express to define our various API endpoints and
// provide their handlers that we implemented in routes.js
app.get('/author/:type', routes.author);
app.get('/random', routes.random);
app.get('/hotels/:hotel_id', routes.hotel);
app.get('/flights/:legID', routes.flight);
app.get('/randomdest/:startAirport',routes.random_dest);
app.get('/airbnb/:airbnb_id',routes.airbnb);
app.get('/hotelrank/',routes.hotel_ranking);
app.get('/oneway_hotel/',routes.oneway_trip_hotel);
app.get('/oneway_airbnb/',routes.oneway_trip_airbnb);
app.get('/round_hotel/',routes.round_trip_hotel);
app.get('/round_airbnb/',routes.round_trip_airbnb);
app.get('/topairbnb/',routes.top_airbnb_from_reviews);
app.get('/hotelcity/:city',routes.hotel_city);
app.get('/airbnbcity/:city',routes.airbnb_city);
app.get('/flightcity/:city',routes.flight_city);
app.get('/cheapest_trip/',routes.cheapest_trip);
app.get('/expensive_trip/',routes.expensive_trip);
app.get('/search_flights/',routes.search_oneway_flights);
app.get('/multileg_flights/',routes.multi_flight);
app.listen(config.server_port, () => {
  console.log(`Server running at http://${config.server_host}:${config.server_port}/`)
});

module.exports = app;

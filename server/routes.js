const mysql = require('mysql')
const config = require('./config.json')
let date = new Date()
let today = "2022"+"-"+(date.getMonth()+1)+"-"+date.getDate()
const connection = mysql.createConnection({
  host: config.rds_host,
  user: config.rds_user,
  password: config.rds_password,
  port: config.rds_port,
  database: config.rds_db
});
connection.connect((err) => err && console.log(err));


const author = async function(req, res) {
  const names = 'Chengyi Zhang, Nimisha Salve, Kevin Hu, Shreyans Tiwari';
  const pennKeys = 'chengyiz, nsalve, ..., shreytiw';

  if (req.params.type === 'names') {
    res.send(`Created by ${names}`);
  } else if (req.params.type === 'pennkeys') {
    res.send(`Created by ${pennKeys}`);
  } else {
    res.status(400).send(`'${req.params.type}' is not a valid author type. Valid types are 'names' and 'pennkeys'.`);
  }
}

//route 1, random hotels
const random = async function(req, res) {

  connection.query(`
    SELECT *
    FROM hotels
    ORDER BY RAND()
    LIMIT 1
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json({
        name: data[0].name,
      });
    }
  });
}

//route2 random destination based on given start city
const random_dest = async function(req, res) {
  console.log(req.params.startAirport)
  connection.query(`
    WITH randomFlight AS(
      SELECT *
      FROM Flights f
      WHERE f.startingAirport = '${req.params.startAirport}'
      AND flightDate = '${today}'
      ORDER BY flightDate DESC
      )
    SELECT *
    FROM randomFlight f JOIN hotels h ON f.destinationAirport = h.IATA_CODE
    ORDER BY RAND()
    LIMIT 1;
  `, (err, data) => {
    if (err || data.length === 0) {
      // if there is an error for some reason, or if the query is empty (this should not be possible)
      // print the error message and return an empty object instead
      console.log(err);
      res.json({});
    } else {
      res.json(data[0]);
    }
  });
}

//route3: specific info about hotel
const hotel = async function(req, res) {
  connection.query(`
  SELECT *
  FROM hotels
  WHERE hotel_id = '${req.params.hotel_id}'
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data[0]);
    }
  });
}

//route4: specific info about flight
const flight = async function(req, res) {
  connection.query(`
  SELECT *
  FROM Flights
  WHERE legID = '${req.params.legID}'
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data[0]);
    }
  });
}

//route5: specific info about airbnb
const airbnb = async function(req, res) {
  connection.query(`
  SELECT *
  FROM Airbnb
  WHERE airbnb_id = '${req.params.airbnb_id}'
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data[0]);
    }
  });
}

//route6: highest rated hotels
const hotel_ranking = async function(req, res) {
  const page = req.query.page;
  const pageSize = req.query.page_size >=0 ? req.query.page_size : 10;
  if(!page){  
    connection.query(`
  SELECT *
  FROM hotels
  ORDER BY rating DESC;
  
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data);
    }
  });
}else{
  connection.query(`
  SELECT *
  FROM hotels
  ORDER BY rating DESC
  LIMIT ${pageSize} OFFSET ${pageSize*(page-1)}
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data);
    }
  });

}
}
//route7: oneway trip with hotel
const oneway_trip_hotel = async function(req, res) {
  req.query.page_size >=0 ? req.query.page_size : 10;
  const start_airport = ('startap' in req.query) ? req.query.startap : '';
  const dest_airport = ('destap' in req.query) ? req.query.destap:'';
  const flight_date = req.query.date ?? today;
  console.log("date:"+flight_date);
  const stay_duration = ('duration' in req.query) ? req.query.duration:1;
  connection.query(`
  WITH flight AS(
    SELECT *
    FROM Flights
    WHERE startingAirport = '${start_airport}' AND destinationAirport = '${dest_airport}' AND DATE(flightDate) = '${flight_date}'
  ) SELECT legId as id, H.name AS hotel_name, H.address AS hotel_address, H.price AS hotel_price, F.*, (H.price*'${stay_duration}'+F.totalFare) AS total_price,
  segmentsAirlineName AS airlineName, seatsRemaining, isRefundable,F.totalFare AS flightPirce,segmentsDepartureTimeRaw as depTime, segmentsArrivalTimeRaw as arrivalTime
  FROM hotels H JOIN flight F ON H.IATA_CODE = F.destinationAirport
  ORDER BY total_price ASC;
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data);
    }
  });
}

//TOFIX
//route8: one way trip with airbnb
const oneway_trip_airbnb = async function(req, res) {
  req.query.page_size >=0 ? req.query.page_size : 10;
  const start_airport = ('startap' in req.query) ? req.query.startap : '';
  const dest_airport = ('destap' in req.query) ? req.query.destap:'';
  const flight_date = ('date' in req.query) ? req.query.date:today;
  const stay_duration = ('duration' in req.query) ? req.query.duration:1;
  connection.query(`
  WITH start_ap AS(
    SELECT IATA_CODE as START_IATA_CODE
    FROM airports
    WHERE AIRPORT = '${start_airport}'
    ),
    end_ap AS(
        SELECT IATA_CODE as END_IATA_CODE
        FROM airports
        WHERE AIRPORT = '${dest_airport}'
    ),
    Departure_flight AS(
	SELECT *
	FROM Flights JOIN start_ap S ON S.START_IATA_CODE = Flights.startingAirport
    JOIN end_ap E ON E.END_IATA_CODE = Flights.destinationAirport
	AND flightDate = '${flight_date}'
    )
    SELECT a.airbnb_name,a.host_name, a.airbnb_price, F.*, (a.price*'${stay_duration}'+F.totalFare) AS total_price
    FROM Airbnb a JOIN Departure_flight F ON a.airport_code = F.destinationAirport
    ORDER BY total_price ASC;
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data);
    }
  });
}

//TOFIX
//route9: round trip with hotel
const round_trip_hotel = async function(req, res) {
  req.query.page_size >=0 ? req.query.page_size : 10;
  const start_airport = ('startap' in req.query) ? req.query.startap : '';
  const dest_airport = ('destap' in req.query) ? req.query.destap:'';
  const departure_date = ('dep_date' in req.query) ? req.query.dep_date:today;
  const return_date = ('ret_date' in req.query) ? req.query.ret_date:today;
  const stay_duration = ('duration' in req.query) ? req.query.duration:1;
  connection.query(`
  WITH start_ap AS(
    SELECT IATA_CODE as START_IATA_CODE
    FROM airports
    WHERE AIRPORT = '${start_airport}'
    ),
    end_ap AS(
        SELECT IATA_CODE as END_IATA_CODE
        FROM airports
        WHERE AIRPORT = '${dest_airport}'
    ),
    Departure_flights AS(
      SELECT *
      FROM Flights JOIN start_ap S ON S.START_IATA_CODE = Flights.startingAirport
      JOIN end_ap E ON E.END_IATA_CODE = Flights.destinationAirport
      AND flightDate = '${departure_date}'
    ),
    Return_flights AS(
      SELECT *
      FROM Flights JOIN end_ap E ON E.END_IATA_CODE = Flights.startingAirport
      JOIN start_ap S ON S.START_IATA_CODE = Flights.destinationAirport
      AND flightDate = '${return_date}'
    ),
    hotel_options AS(
      SELECT name AS hotel_name, address AS hotel_address, price AS hotel_price, IATA_CODE, city
      FROM hotels
    )
    SELECT 
      ho.hotel_name, ho.hotel_address, ho.hotel_price,
      df.flightDate AS departure_date, df.startingAirport AS dep_startingAirport, 
      df.airline AS dep_airline, df.departureTime AS dep_departureTime,
      rf.flightDate AS return_date, rf.startingAirport AS ret_startingAirport, 
      rf.airline AS ret_airline, rf.departureTime AS ret_departureTime, 
      (ho.hotel_price * '${stay_duration}' + df.totalFare + rf.totalFare) AS total_price
    FROM hotel_options ho 
    JOIN Departure_flights df ON ho.IATA_CODE = df.destinationAirport AND ho.city = '${dest_airport}'
    JOIN Return_flights rf ON ho.IATA_CODE = rf.startingAirport AND ho.city = '${start_airport}'
    ORDER BY total_price ASC;
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data);
    }
  });
}

//TOFIX
//route10: round trip with airbnb
const round_trip_airbnb =async function(req, res) {
  req.query.page_size >=0 ? req.query.page_size : 10;
  const start_airport = ('startap' in req.query) ? req.query.startap : '';
  const dest_airport = ('destap' in req.query) ? req.query.destap:'';
  const departure_date = ('dep_date' in req.query) ? req.query.dep_date:today;
  const return_date = ('ret_date' in req.query) ? req.query.ret_date:today;
  const stay_duration = ('duration' in req.query) ? req.query.duration:1;
  connection.query(`
  WITH start_ap AS(
    SELECT IATA_CODE as START_IATA_CODE
    FROM airports
    WHERE AIRPORT = '${start_airport}'
    ),
    end_ap AS(
        SELECT IATA_CODE as END_IATA_CODE
        FROM airports
        WHERE AIRPORT = '${dest_airport}'
    ),
    Departure_flights AS(
      SELECT *
      FROM Flights JOIN start_ap S ON S.START_IATA_CODE = Flights.startingAirport
      JOIN end_ap E ON E.END_IATA_CODE = Flights.destinationAirport
      AND flightDate = '${departure_date}'
    ),
    Return_flights AS(
      SELECT *
      FROM Flights JOIN end_ap E ON E.END_IATA_CODE = Flights.startingAirport
      JOIN start_ap S ON S.START_IATA_CODE = Flights.destinationAirport
      AND flightDate = '${return_date}'
    ),
    airbnb_options AS(
      SELECT airbnb_name , host_name, price AS airbnb_price, airport_code, city
      FROM Airbnb
    )
    SELECT 
      a.hotel_name, a.host_name, a.airbnb_price,
      df.flightDate AS departure_date, df.startingAirport AS dep_startingAirport, 
      df.airline AS dep_airline, df.departureTime AS dep_departureTime,
      rf.flightDate AS return_date, rf.startingAirport AS ret_startingAirport, 
      rf.airline AS ret_airline, rf.departureTime AS ret_departureTime, 
      (a.airbnb_price * '${stay_duration}' + df.totalFare + rf.totalFare) AS total_price
    FROM airbnb_options a
    JOIN Departure_flights df ON ho.IATA_CODE = df.destinationAirport AND a.city = '${dest_airport}'
    JOIN Return_flights rf ON ho.IATA_CODE = rf.startingAirport AND a.city = '${start_airport}'
    ORDER BY total_price ASC;
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data);
    }
  });
}
  //TOFIX
 // route 11: Top Airbnb based on reviews
const top_airbnb_from_reviews = async function(req, res) {
  const page = req.query.page;
  const pageSize = req.query.page_size >=0 ? req.query.page_size : 10;
  if(!page){
    connection.query( `
  WITH property_reviews AS (
    SELECT airbnb_id, airbnb_name, number_of_reviews/100  AS avg_rating, number_of_reviews AS num_reviews
        FROM (
          SELECT airbnb_id, airbnb_name, review_per_month, number_of_reviews
          FROM Airbnb
        ) AS reviews
        GROUP BY airbnb_name,airbnb_id
      ),
      top_properties AS (
        SELECT airbnb_id, airbnb_name, avg_rating, num_reviews
        FROM property_reviews
        ORDER BY avg_rating DESC, num_reviews DESC
      )
      SELECT properties.*, top_properties.avg_rating, top_properties.num_reviews
      FROM (
        SELECT airbnb_id, 'Airbnb' AS Type,airbnb_name as name,  city, price, review_per_month
        FROM Airbnb
      ) AS properties
      JOIN top_properties ON properties.name = top_properties.airbnb_name
      ORDER BY top_properties.avg_rating DESC, top_properties.num_reviews DESC
      LIMIT ${pageSize} OFFSET ${pageSize*(page-1)};
    `, (err, data) => {
        if (err || data.length === 0) {
            console.log(err);
            res.json({});
          } else {
            res.json(data);
          }
        });

  }
  else
  {connection.query( `
  WITH property_reviews AS (
    SELECT airbnb_id, airbnb_name, number_of_reviews/100  AS avg_rating, number_of_reviews AS num_reviews
        FROM (
          SELECT airbnb_id, airbnb_name, review_per_month, number_of_reviews
          FROM Airbnb
        ) AS reviews
        GROUP BY airbnb_name
      ),
      top_properties AS (
        SELECT airbnb_id, airbnb_name, avg_rating, num_reviews
        FROM property_reviews
        ORDER BY avg_rating DESC, num_reviews DESC
      )
      SELECT properties.*, top_properties.avg_rating, top_properties.num_reviews
      FROM (
        SELECT airbnb_id, 'Airbnb' AS Type,airbnb_name as name,  city, price, review_per_month
        FROM Airbnb
      ) AS properties
      JOIN top_properties ON properties.name = top_properties.airbnb_name
      ORDER BY top_properties.avg_rating DESC, top_properties.num_reviews DESC
      LIMIT ${pageSize} OFFSET ${pageSize*(page-1)};
    `, (err, data) => {
        if (err || data.length === 0) {
            console.log(err);
            res.json({});
          } else {
            res.json(data);
          }
        });}
}
const hotel_city = async function(req, res) {
  console.log("Here!"+req.params.city);
  connection.query(`
    SELECT *
    FROM hotels
    WHERE city = '${req.params.city}'
    ORDER BY RAND()
    LIMIT 10
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data);
    }
  });
}
const airbnb_city = async function(req, res) {
  console.log("airHere!"+req.params.city);
  connection.query(`
    SELECT airbnb_name as name, host_name, room_type, price
    FROM Airbnb
    WHERE city = '${req.params.city}'
    ORDER BY RAND()
    LIMIT 10
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data);
    }
  });
}
const flight_city = async function(req, res) {
  console.log("flightHere!"+req.params.city);
  connection.query(`
  WITH one_way_city_info AS (
    SELECT *
    FROM airports
    WHERE CITY = '${req.params.city}')
    
    SELECT f.flightDate, f.totalFare,f.segmentsAirlineName AS airlineName
    FROM one_way_city_info ow JOIN Flights f ON ow.IATA_CODE = f.destinationAirport
    WHERE f.startingAirport = 'SFO'
    ORDER BY RAND()
    LIMIT 10;
    
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data);
    }
  });
}

const cheapest_trip = async function(req, res) {
  console.log("here!"+req.query.dest_city+req.query.start_city+req.query.duration);
  req.query.page_size >=0 ? req.query.page_size : 10;
  const dest_city = req.query.dest_city ? req.query.dest_city:'';
  const start_city = req.query.start_city ? req.query.start_city:'';
  const stay_duration = req.query.duration ? req.query.duration:1;
  connection.query(`
  WITH one_way_city_info AS ( 
    SELECT *
    FROM airports
    WHERE IATA_CODE = '${dest_city}'),
    
    two_way_city_info AS (
    SELECT *
    FROM airports
    WHERE IATA_CODE = '${start_city}'),
    
    Departure_flight AS(
    SELECT *, DATE_ADD(flightDate, INTERVAL '${stay_duration}' DAY) AS return_date
        FROM Flights JOIN one_way_city_info ow ON Flights.startingAirport = ow.IATA_CODE
    #WHERE startingAirport = '${dest_city}' AND destinationAirport = '${start_city}'
      ),
    Return_flight AS(
        SELECT *
        FROM Flights JOIN two_way_city_info tw ON Flights.startingAirport = tw.IATA_CODE
    #WHERE startingAirport = '${start_city}' AND destinationAirport = '${dest_city}'
      )
    SELECT H.name AS hotel_name, H.city , H.price AS hotel_price,
      DF.totalFare AS departure_flight_price, RF.totalFare AS return_flight_price,  ROUND(H.price* '${stay_duration}' + DF.totalFare + RF.totalFare,1) AS total_price
      FROM hotels H JOIN Departure_flight DF ON H.IATA_CODE=DF.startingAirport
      JOIN Return_flight RF ON DF.destinationAirport = RF.startingAirport
      AND DATE_ADD(DF.flightDate, INTERVAL '${stay_duration}' DAY)= RF.flightDate
      ORDER BY total_price ASC
      LIMIT 1
    `, (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json({});
      } else {
        res.json(data[0]);
      }
    });
  }
  const expensive_trip = async function(req, res) {

    req.query.page_size >=0 ? req.query.page_size : 10;
    const dest_city = req.query.dest_city ? req.query.dest_city:'';
    const start_city = req.query.start_city ? req.query.start_city:'';
    const stay_duration = ('duration' in req.query) ? req.query.duration:1;
    connection.query(`
    WITH one_way_city_info AS ( 
      SELECT *
      FROM airports
      WHERE IATA_CODE = '${dest_city}'),
      
      two_way_city_info AS (
      SELECT *
      FROM airports
      WHERE IATA_CODE = '${start_city}'),
      
      Departure_flight AS(
      SELECT *, DATE_ADD(flightDate, INTERVAL '${stay_duration}' DAY) AS return_date
          FROM Flights JOIN one_way_city_info ow ON Flights.startingAirport = ow.IATA_CODE
      #WHERE startingAirport = '${dest_city}' AND destinationAirport = '${start_city}'
        ),
      Return_flight AS(
          SELECT *
          FROM Flights JOIN two_way_city_info tw ON Flights.startingAirport = tw.IATA_CODE
      #WHERE startingAirport = '${start_city}' AND destinationAirport = '${dest_city}'
        )
      SELECT H.name AS hotel_name, H.city , H.price AS hotel_price,
        DF.totalFare AS departure_flight_price, RF.totalFare AS return_flight_price,  ROUND(H.price* '${stay_duration}' + DF.totalFare + RF.totalFare,1) AS total_price
        FROM hotels H JOIN Departure_flight DF ON H.IATA_CODE=DF.startingAirport
        JOIN Return_flight RF ON DF.destinationAirport = RF.startingAirport
        AND DATE_ADD(DF.flightDate, INTERVAL '${stay_duration}' DAY)= RF.flightDate
        ORDER BY total_price DESC
        LIMIT 1
      `, (err, data) => {
        if (err || data.length === 0) {
          console.log(err);
          res.json({});
        } else {
          res.json(data[0]);
        }
      });
  }
// route 13: Search One-Way Flights
const search_oneway_flights = async function(req, res) {
  const start_airport = req.query.start_airport ?? '';
  const dest_airport = req.query.dest_airport ?? '';
  const departure_date = req.query.departure_date ?? today;
  const price_low = req.query.price_low ?? 0;
  const price_high = req.query.price_high ?? 10000;
  const num_travellers = req.query.num_travellers ?? 1
  const num_stops = req.query.num_stops ?? 0

  if (num_stops == 0) {
    connection.query(`
        SELECT legId AS TripId,
        segmentsAirlineName AS Airline,
        startingAirport AS DepartFrom,
        destinationAirport AS ArriveAt,
        NULL AS FirstVia,
        NULL AS SecondVia,
        segmentsDepartureTimeRaw AS DepartureTime,
        NULL AS FirstConnectingArrivalTime,
        NULL AS FirstLayover,
        NULL AS FirstConnectingDepartureTime,
        NULL AS SecondConnectingArrivalTime,
        NULL AS SecondLayover,
        NULL AS SecondConnectingDepartureTime,
        segmentsArrivalTimeRaw AS ArrivalTime,
        TIMEDIFF(segmentsArrivalTimeRaw, segmentsDepartureTimeRaw) AS TotalTime,
        totalFare AS Fare
        FROM Flights
        WHERE startingAirport = '${start_airport}'
        AND destinationAirport = '${dest_airport}'
        AND DATE(flightDate) = '${departure_date}'
        AND seatsRemaining >= ${num_travellers}
        AND totalFare BETWEEN ${price_low} AND ${price_high}
        ORDER BY Fare;
      `, (err, data) => {
      if (err) {
        console.log(err);
        res.json([]);
      } else {
        res.json(data);
      }
    });
  }
  else if (num_stops == 1) {
    connection.query(`
        WITH NonStopFlights AS (
          SELECT legId AS TripId,
          segmentsAirlineName AS Airline,
          startingAirport AS DepartFrom,
          destinationAirport AS ArriveAt,
          NULL AS FirstVia,
          NULL AS SecondVia,
          segmentsDepartureTimeRaw AS DepartureTime,
          NULL AS FirstConnectingArrivalTime,
          NULL AS FirstLayover,
          NULL AS FirstConnectingDepartureTime,
          NULL AS SecondConnectingArrivalTime,
          NULL AS SecondLayover,
          NULL AS SecondConnectingDepartureTime,
          segmentsArrivalTimeRaw AS ArrivalTime,
          TIMEDIFF(segmentsArrivalTimeRaw, segmentsDepartureTimeRaw) AS TotalTime,
          totalFare AS Fare
          FROM Flights
          WHERE startingAirport = '${start_airport}'
          AND destinationAirport = '${dest_airport}'
          AND DATE(flightDate) = '${departure_date}'
          AND seatsRemaining >= ${num_travellers}
          AND totalFare BETWEEN ${price_low} AND ${price_high}
        ),
        OneStopFlights AS (
          SELECT CONCAT_WS(',', a.legId, b.legId) AS TripId,
          a.segmentsAirlineName AS Airline,
          a.startingAirport AS DepartFrom,
          b.destinationAirport AS ArriveAt,
          a.destinationAirport AS FirstVia,
          NULL AS SecondVia,
          a.segmentsDepartureTimeRaw AS DepartureTime,
          a.segmentsArrivalTimeRaw AS FirstConnectingArrivalTime,
          TIMEDIFF(b.segmentsDepartureTimeRaw, a.segmentsArrivalTimeRaw) AS FirstLayover,
          b.segmentsDepartureTimeRaw AS FirstConnectingDepartureTime,
          NULL AS SecondConnectingArrivalTime,
          NULL AS SecondLayover,
          NULL AS SecondConnectingDepartureTime,
          b.segmentsArrivalTimeRaw AS ArrivalTime,
          TIMEDIFF(b.segmentsArrivalTimeRaw, a.segmentsDepartureTimeRaw) AS TotalTime,
          ROUND((a.totalFare + b.totalFare), 2) AS Fare
          FROM Flights a JOIN Flights b
          ON a.destinationAirport = b.startingAirport
          AND a.segmentsAirlineName = b.segmentsAirlineName
          AND TIMESTAMPDIFF(MINUTE, a.segmentsArrivalTimeRaw, b.segmentsDepartureTimeRaw) BETWEEN 45 AND 360
          WHERE a.startingAirport = '${start_airport}'
          AND b.destinationAirport = '${dest_airport}'
          AND DATE(a.flightDate) = '${departure_date}'
          AND a.seatsRemaining >= ${num_travellers}
          AND b.seatsRemaining >= ${num_travellers}
          AND (a.totalFare + b.totalFare) BETWEEN ${price_low} AND ${price_high}
        )
        (SELECT * FROM NonStopFlights)
        UNION
        (SELECT * FROM OneStopFlights)
        ORDER BY Fare, TotalTime;  
      `, (err, data) => {
      if (err) {
        console.log(err);
        res.json([]);
      } else {
        res.json(data);
      }
    });
  }
  else {
    connection.query(`
        WITH NonStopFlights AS (
          SELECT legId AS TripId,
          segmentsAirlineName AS Airline,
          startingAirport AS DepartFrom,
          destinationAirport AS ArriveAt,
          NULL AS FirstVia,
          NULL AS SecondVia,
          segmentsDepartureTimeRaw AS DepartureTime,
          NULL AS FirstConnectingArrivalTime,
          NULL AS FirstLayover,
          NULL AS FirstConnectingDepartureTime,
          NULL AS SecondConnectingArrivalTime,
          NULL AS SecondLayover,
          NULL AS SecondConnectingDepartureTime,
          segmentsArrivalTimeRaw AS ArrivalTime,
          TIMEDIFF(segmentsArrivalTimeRaw, segmentsDepartureTimeRaw) AS TotalTime,
          totalFare AS Fare
          FROM Flights
          WHERE startingAirport = '${start_airport}'
          AND destinationAirport = '${dest_airport}'
          AND DATE(flightDate) = '${departure_date}'
          AND seatsRemaining >= ${num_travellers}
          AND totalFare BETWEEN ${price_low} AND ${price_high}
        ),
        OneStopFlights AS (
          SELECT CONCAT_WS(',', a.legId, b.legId) AS TripId,
          a.segmentsAirlineName AS Airline,
          a.startingAirport AS DepartFrom,
          b.destinationAirport AS ArriveAt,
          a.destinationAirport AS FirstVia,
          NULL AS SecondVia,
          a.segmentsDepartureTimeRaw AS DepartureTime,
          a.segmentsArrivalTimeRaw AS FirstConnectingArrivalTime,
          TIMEDIFF(b.segmentsDepartureTimeRaw, a.segmentsArrivalTimeRaw) AS FirstLayover,
          b.segmentsDepartureTimeRaw AS FirstConnectingDepartureTime,
          NULL AS SecondConnectingArrivalTime,
          NULL AS SecondLayover,
          NULL AS SecondConnectingDepartureTime,
          b.segmentsArrivalTimeRaw AS ArrivalTime,
          TIMEDIFF(b.segmentsArrivalTimeRaw, a.segmentsDepartureTimeRaw) AS TotalTime,
          ROUND((a.totalFare + b.totalFare), 2) AS Fare
          FROM Flights a JOIN Flights b
          ON a.destinationAirport = b.startingAirport
          AND a.segmentsAirlineName = b.segmentsAirlineName
          AND TIMESTAMPDIFF(MINUTE, a.segmentsArrivalTimeRaw, b.segmentsDepartureTimeRaw) BETWEEN 45 AND 360
          WHERE a.startingAirport = '${start_airport}'
          AND b.destinationAirport = '${dest_airport}'
          AND DATE(a.flightDate) = '${departure_date}'
          AND a.seatsRemaining >= ${num_travellers}
          AND b.seatsRemaining >= ${num_travellers}
          AND (a.totalFare + b.totalFare) BETWEEN ${price_low} AND ${price_high}
        ),
        TwoStopFlights AS (
          SELECT CONCAT_WS(',', a.legId, b.legId, c.legId) AS TripId,
          a.segmentsAirlineName AS Airline,
          a.startingAirport AS DepartFrom,
          c.destinationAirport AS ArriveAt,
          a.destinationAirport AS FirstVia,
          b.destinationAirport AS SecondVia,
          a.segmentsDepartureTimeRaw AS DepartureTime,
          a.segmentsArrivalTimeRaw AS FirstConnectingArrivalTime,
          TIMEDIFF(b.segmentsDepartureTimeRaw, a.segmentsArrivalTimeRaw) AS FirstLayover,
          b.segmentsDepartureTimeRaw AS FirstConnectingDepartureTime,
          b.segmentsArrivalTimeRaw AS SecondConnectingArrivalTime,
          TIMEDIFF(c.segmentsDepartureTimeRaw, b.segmentsArrivalTimeRaw) AS SecondLayover,
          c.segmentsDepartureTimeRaw AS SecondConnectingDepartureTime,
          b.segmentsArrivalTimeRaw AS ArrivalTime,
          TIMEDIFF(b.segmentsArrivalTimeRaw, a.segmentsDepartureTimeRaw) AS TotalTime,
          ROUND((a.totalFare + b.totalFare), 2) AS Fare
          FROM Flights a JOIN Flights b
          ON a.destinationAirport = b.startingAirport
          AND a.segmentsAirlineName = b.segmentsAirlineName
          AND TIMESTAMPDIFF(MINUTE, a.segmentsArrivalTimeRaw, b.segmentsDepartureTimeRaw) BETWEEN 45 AND 180
          JOIN Flights c
          ON b.destinationAirport = c.startingAirport
          AND b.segmentsAirlineName = c.segmentsAirlineName
          AND TIMESTAMPDIFF(MINUTE, b.segmentsArrivalTimeRaw, c.segmentsDepartureTimeRaw) BETWEEN 45 AND 180
          WHERE a.startingAirport = '${start_airport}'
          AND a.destinationAirport <> '${dest_airport}'
          AND b.destinationAirport <> '${start_airport}'
          AND c.destinationAirport = '${dest_airport}'
          AND DATE(a.flightDate) = '${departure_date}'
          AND a.seatsRemaining >= ${num_travellers}
          AND b.seatsRemaining >= ${num_travellers}
          AND c.seatsRemaining >= ${num_travellers}
          AND (a.totalFare + b.totalFare + c.totalFare) BETWEEN ${price_low} AND ${price_high}
        )
        (SELECT * FROM NonStopFlights)
        UNION
        (SELECT * FROM OneStopFlights)
        UNION
        (SELECT * FROM TwoStopFlights)
        ORDER BY Fare, TotalTime; 
      `, (err, data) => {
      if (err) {
        console.log(err);
        res.json([]);
      } else {
        res.json(data);
      }
    });
  }
}

//route14: specific info about multileg flight
const multi_flight = async function(req, res) {
  const legsStr = req.query.legIds ?? '';
  const legIds = legsStr.split(",");

  if (legIds.length == 1) {
    connection.query(`
      SELECT *
      FROM Flights
      WHERE legID = '${legIds[0]}'
      `, (err, data) => {
        if (err || data.length === 0) {
          console.log(err);
          res.json([]);
        } else {
          res.json(data);
        }
    });
  }
  else if (legIds.length == 2) {
    connection.query(`
      (SELECT *
      FROM Flights
      WHERE legID = '${legIds[0]}')
      UNION
      (SELECT *
      FROM Flights
      WHERE legID = '${legIds[1]}')
      `, (err, data) => {
        if (err || data.length === 0) {
          console.log(err);
          res.json([]);
        } else {
          res.json(data);
        }
    });
  }
  else {
    connection.query(`
      (SELECT *
      FROM Flights
      WHERE legID = '${legIds[0]}')
      UNION
      (SELECT *
      FROM Flights
      WHERE legID = '${legIds[1]}')
      UNION
      (SELECT *
      FROM Flights
      WHERE legID = '${legIds[2]}')
      `, (err, data) => {
        if (err || data.length === 0) {
          console.log(err);
          res.json([]);
        } else {
          res.json(data);
        }
    });
  }
}

module.exports = {
  author,
  random,
  hotel,
  flight,
  airbnb,
  random_dest,
  hotel_ranking,
  oneway_trip_hotel,
  oneway_trip_airbnb,
  round_trip_hotel,
  round_trip_airbnb,
  top_airbnb_from_reviews,
  hotel_city,
  airbnb_city,
  flight_city,
  cheapest_trip,
  expensive_trip,
  search_oneway_flights,
  multi_flight
}

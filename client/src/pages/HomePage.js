import { useEffect, useState } from 'react';
import {Box, Container, Divider, Link } from '@mui/material';
import { NavLink } from 'react-router-dom';

import LazyTable from '../components/LazyTable';
import HotelCard from '../components/hotelCard';
import AirbnbCard from '../components/AirbnbCard';
const config = require('../config.json');

let date = new Date()
let today = (date.getMonth()+1)+"/"+date.getDate()+", 2023"
export default function HomePage() {

  // TODO (TASK 13): add a state variable to store the app author (default to '')
  const [appAuthor, setAppAuthor] = useState('');

  const [selectedHotelId, setSelectedHotelId] = useState(null);
  const [selectedAirbnbId, setSelectedAirbnbId] = useState(null);

  const flexFormat = { display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-evenly' };
  // The useEffect hook by default runs the provided callback after every render
  // The second (optional) argument, [], is the dependency array which signals
  // to the hook to only run the provided callback if the value of the dependency array
  // changes from the previous render. In this case, an empty array means the callback
  // will only run on the very first render.
  useEffect(() => {
    // TODO (TASK 14): add a fetch call to get the app author (name not pennkey) and store it in the state variable
    fetch(`http://${config.server_host}:${config.server_port}/author/names`)
    .then(res => res.text())
    .then(resJson => setAppAuthor(resJson));
  }, []);

  // Here, we define the columns of the "Top Songs" table. The songColumns variable is an array (in order)
  // of objects with each object representing a column. Each object has a "field" property representing
  // what data field to display from the raw data, "headerName" property representing the column label,
  // and an optional renderCell property which given a row returns a custom JSX element to display in the cell.
  const hotelColumns = [
    {
      field: 'name',
      headerName: 'Hotel Name',
      renderCell: (row) => <Link onClick={() => setSelectedHotelId(row.hotel_id)}>{row.name}</Link> // A Link component is used just for formatting purposes
    },
    {
      field: 'city',
      headerName: 'City',
      renderCell: (row) => <NavLink to={`/albums/${row.city}`}>{row.city}</NavLink> // A NavLink component is used to create a link to the album page
    },
    {
      field: 'rating',
      headerName: 'Rating'
    },
  ];

  const airbnbColumns = [
    {
      field: 'name',
      headerName: 'Airbnb Name',
      renderCell: (row) => <Link onClick={() => setSelectedAirbnbId(row.airbnb_id)}>{row.name}</Link>
    },
    {
      field: 'city',
      headerName: 'City',
    },
    {
      field: 'avg_rating',
      headerName: 'Rating'
    },
  ]

  return (
    <Container> 
      {selectedHotelId && <HotelCard hotel_id={selectedHotelId} handleClose={() => setSelectedHotelId(null)} />}
      {selectedAirbnbId && <AirbnbCard airbnb_id={selectedAirbnbId} handleClose={() => setSelectedAirbnbId(null)} />}
      <h2>Today is {today}</h2>
      <Divider />
      <h2>Top hotels 
      <img
            src={"https://www.pngall.com/wp-content/uploads/5/Hotel-PNG.png" }
            width = "100" 
            height = "100"
          />
      </h2>
      <LazyTable route={`http://${config.server_host}:${config.server_port}/hotelrank`} columns={hotelColumns} />
      <Divider />
      <Divider />
      <h2>Top Airbnbs
      <img
            src={"https://logodownload.org/wp-content/uploads/2016/10/airbnb-logo-0.png" }
            width = "100" 
            height = "100"
          />
      </h2>
      <LazyTable route = {`http://${config.server_host}:${config.server_port}/topairbnb`} columns = {airbnbColumns}/>
      <Divider />
      <h2>Cities </h2>
      <Divider />
      <Container style = {flexFormat}>
      <Box
          key={1}
          p={3}
          m={2}
          style={{ background: 'white', borderRadius: '16px', border: '2px solid #000' }}
        >
          {
          <img
          src={"https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Los_Angeles_with_Mount_Baldy.jpg/417px-Los_Angeles_with_Mount_Baldy.jpg" }
          width = "300" 
          height = "200"
          alt={"Los Angeles"}
          />
          }
          <h4><NavLink to={`/city/Los Angeles`}>{"Los Angeles"}</NavLink></h4>
        </Box>
        <Box
          key={2}
          p={3}
          m={2}
          style={{ background: 'white', borderRadius: '16px', border: '2px solid #000' }}
        >
          {
          <img
          src={"https://oceandrive.com/get/files/image/galleries/miami-facts-GettyImages-1202852911.jpg"}
          width = "300" 
          height = "200"
          alt={"Miami"}
          />
          }
          <h4><NavLink to={`/city/Miami`}>{"Miami"}</NavLink></h4>
        </Box>
        <Box
          key={2}
          p={3}
          m={2}
          style={{ background: 'white', borderRadius: '16px', border: '2px solid #000' }}
        >
          {
          <img
          src={"https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/View_of_Empire_State_Building_from_Rockefeller_Center_New_York_City_dllu_%28cropped%29.jpg/1200px-View_of_Empire_State_Building_from_Rockefeller_Center_New_York_City_dllu_%28cropped%29.jpg"}
          width = "300" 
          height = "200"
          alt={"New York"}
          />
          }
          <h4><NavLink to={`/city/New York`}>{"New York"}</NavLink></h4>
        </Box>
        <Box
          key={2}
          p={3}
          m={2}
          style={{ background: 'white', borderRadius: '16px', border: '2px solid #000' }}
        >
          {
          <img
          src={"https://www.discoverphl.com/wp-content/uploads/2023/01/Discover-Philaphia.00_00_02_14.Still001-1024x576.jpg"}
          width = "300" 
          height = "200"
          alt={"Philadelphia"}
          />
          }
          <h4><NavLink to={`/city/Philadelphia`}>{"Philadelphia"}</NavLink></h4>
        </Box>
      </Container>
      <p>{appAuthor}</p>
    </Container>
  );
};
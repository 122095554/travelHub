import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {Divider, Container, Link, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import LazyTable from '../components/LazyTable';
import HotelCard from '../components/hotelCard';
import { formatDuration, formatReleaseDate } from '../helpers/formatter';
import { NavLink } from 'react-router-dom';
const config = require('../config.json');

export default function CityPage() {
  const { city } = useParams();

  const [selectedHotelId, setSelectedHotelId] = useState(null);

  const hotelColumns = [
    {
      field: 'name',
      headerName: 'Hotel Name',
      renderCell: (row) => <Link onClick={() => setSelectedHotelId(row.hotel_id)}>{row.name}</Link> // A Link component is used just for formatting purposes
    },
    {
      field: 'city',
      headerName: 'City',
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
      renderCell: (row) => <NavLink to={`/airbnb/${row.airbnb_id}`}>{row.name}</NavLink>
    },
    {
      field: 'host_name',
      headerName: 'Host Name',
    },
    {
        field: 'room_type',
        headerName: 'Type',
      },
      {
        field: 'price',
        headerName: 'Price',
      },
  ];
  const flightColumns = [
    {
      field: 'flightDate',
      headerName: 'Flight Date',
    },
    {
      field: 'airlineName',
      headerName: 'Airline Name',
    },
    {
      field: 'totalFare',
      headerName: 'Total Price',
    },
    
  ];
  return (
    <Container>
      {selectedHotelId && <HotelCard hotel_id={selectedHotelId} handleClose={() => setSelectedHotelId(null)} />}
      <Stack direction='row' justify='center'>
        <Stack>
          <h1 style={{ fontSize: 64 }}>{city}</h1>
        </Stack>
      </Stack>
      <h2>Top hotels 
      <img
            src={"https://www.pngall.com/wp-content/uploads/5/Hotel-PNG.png" }
            width = "100" 
            height = "100"
          />
      </h2>
      <LazyTable route={`http://${config.server_host}:${config.server_port}/hotelcity/${city}`} columns={hotelColumns} />
      <Divider />
      <h2>Top Airbnbs
      <img
            src={"https://logodownload.org/wp-content/uploads/2016/10/airbnb-logo-0.png" }
            width = "100" 
            height = "100"
          />
      </h2>
      <LazyTable route = {`http://${config.server_host}:${config.server_port}/airbnbcity/${city}`} columns = {airbnbColumns}/>
      <Divider />
      <h2>Top FLights
      <img
            src={"https://static.vecteezy.com/system/resources/thumbnails/000/620/372/small/aviation_logo-22.jpg" }
            width = "150" 
            height = "150"
          />
      </h2>
      <LazyTable route = {`http://${config.server_host}:${config.server_port}/flightcity/${city}`} columns = {flightColumns}/>
      <Divider />
    </Container>
  );
}
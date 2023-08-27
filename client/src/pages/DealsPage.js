import { useEffect, useState } from 'react';
import {Autocomplete,Button, Box, Container , Grid,TextField, CircularProgress } from '@mui/material';

import { NavLink, Link } from 'react-router-dom';
import LazyTable from '../components/LazyTable';
import styled from "styled-components";


const config = require('../config.json');

export const DropdownWrapper = styled.form`
  display: flex;
  flex-flow: column;
  justify-content: flex-start;
`;
export default function DealsPage() {
  const [cheapData, setcheapData] = useState({});
  const [expensiveData, setexpensiveData] = useState({});
  const [selectedHotelId, setSelectedHotelId] = useState(null);
  const [start_city, setStart] = useState('');
  const [dest_city, setEnd] = useState('');
  const [loading, setLoading] = useState(false);

  const [stay_duration, setDuration] = useState(1);
  const search = () => {
    setLoading(true);
    console.log()
    fetch(`http://${config.server_host}:${config.server_port}/cheapest_trip?start_city=${start_city}` +
    `&dest_city=${dest_city}&duration=${stay_duration}`)
      .then(res => res.json())
      .then(resJson => {
        setcheapData(resJson)
        fetch(`http://${config.server_host}:${config.server_port}/expensive_trip?start_city=${start_city}` +
                `&dest_city=${dest_city}&duration=${stay_duration}`)
        .then(res => res.json())
        .then(resJson => setexpensiveData(resJson));
        setLoading(false);
      });
    };

    const AdornedButton = (props) => {
      const {
        children,
        loading,
        ...rest
      } = props
      return (
        <Button {...rest}>
          {children}
          {loading && <CircularProgress {...rest} />}
        </Button>
      )
    }
    const airports = ["ATL (Atlanta, GA)", "BOS (Boston, MA)", "CLT (Charlotte, NC)",
    "DEN (Denver, CO)", "DFW (Dallas, TX)", "DTW (Detroit, MI)",
    "EWR (Newark, NJ)", "IAD (Washington, DC)", "JFK (New York, NY)",
    "LAX (Los Angeles, CA)", "LGA (New York, NY)", "MIA (Miami, FL)",
    "OAK (Oakland, CA)", "ORD (Chicago, IL)", "PHL (Philadelphia, PA)",
    "SFO (San Francisco, CA)"];
  const flexFormat = { display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-evenly' };
  
  return (
    <Container style={flexFormat}>
      <div className="App">
      {selectedHotelId}
      <h2>Search Trips</h2>
      <Grid container spacing={12}>
          <Grid item xs={4}>
            <Autocomplete
              autoSelect
              onInputChange={(e, value) => {
                  setStart(value.split(" ")[0]);
                }}
              options={airports}
              renderInput={(params) => <TextField {...params} label='Flying From' />}
              sx={{ width: "100%" }}/>
          </Grid>
          <Grid item xs={4}>
          <Autocomplete
              autoSelect
              onInputChange={(e, value) => {
                  setEnd(value.split(" ")[0]);
                }}
              options={airports}
              renderInput={(params) => <TextField {...params} label='Flying To' />}
              sx={{ width: "100%" }}/>
          </Grid>
        <Grid item xs={4}>
          <TextField label='Stay Duration (in Days)' value={stay_duration} onChange={(e) => setDuration(e.target.value)} style={{ width: "100%" }}/>
        </Grid>
        </Grid>
        <AdornedButton loading={loading} onClick={() => {search()}} style={{ left: '50%', transform: 'translateX(-50%)' }} xs={12}>
        Search
      </AdornedButton>
      </div>
      <Grid container spacing={12}>
      <Grid item xs={6}>
      <Box
  key={1}
  p={3}
  m={2}
  style={{ background: 'white', borderRadius: '16px', border: '2px solid #000', display: 'flex', flexDirection: 'row' }}
>
  <div style={{ flex: 2 }}>
    <h4>Budget Friendly!</h4>
    <h3>{cheapData.hotel_name}</h3>
    <p>City: {cheapData.city}</p>
    <p>Hotel Price: ${cheapData.hotel_price}</p>
    <p>One Way Flight Price: ${cheapData.departure_flight_price}</p>
    <p>Return Flight Price: ${cheapData.return_flight_price}</p>
    <p>Total Trip Cost: ${cheapData.total_price}</p>
  </div>
  <div style={{ flex: 0 }}>
    <img
      src={"https://blog.goway.com/globetrotting/wp-content/uploads/2018/11/Travel-savings-in-a-glass-jar-with-dreams-of-globetrotting-budget-concept-_701581432.jpg"}
      width="150"
      height="150"
    />
  </div>
</Box>
        </Grid>
        <Grid item xs={6}>
        <Box
  key={2}
  p={3}
  m={2}
  style={{ background: 'white', borderRadius: '16px', border: '2px solid #000', display: 'flex', flexDirection: 'row' }}
>
  <div style={{ flex: 2 }}>
    <h4>Luxury</h4>
    <h3>{expensiveData.hotel_name}</h3>
    <p>City: {expensiveData.city}</p>
    <p>Hotel Price: ${expensiveData.hotel_price}</p>
    <p>One Way Flight Price: ${expensiveData.departure_flight_price}</p>
    <p>Return Flight Price: ${expensiveData.return_flight_price}</p>
    <p>Total Trip Cost: ${expensiveData.total_price}</p>
  </div>
  <div style={{ flex: 0}}>
    <img
      src={"https://www.researchdive.com/blogImages/nbJxjr77ng.jpeg" }
      width="150" 
      height="150"
    />
  </div>
</Box>
        </Grid>
        </Grid>
    </Container>
  );
}

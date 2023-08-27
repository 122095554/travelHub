import { useEffect, useState } from 'react';
import { Button, Checkbox, Container, FormControlLabel, Grid, Autocomplete, TextField, Link } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs, { Dayjs } from 'dayjs';

import HotelCard from '../components/hotelCard';
const config = require('../config.json');

let date = new Date("2022-04-20")
export default function PlannerPage() {
  const [pageSize, setPageSize] = useState(10);
  const [data, setData] = useState([]);

  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [flightDate, setFlightDate] = useState(date);
  const [duration, setDuration] = useState(1);
  const [selectedHotelId, setSelectedHotelId] = useState(null);
  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/oneway_hotel`)
      .then(res => res.json())
      .then(resJson => {
        const songsWithId = resJson.map((trip) => ({ id: trip.id, ...trip }));
        setData(songsWithId);
      });
  }, []);

  const airports = ["ATL (Atlanta, GA)", "BOS (Boston, MA)", "CLT (Charlotte, NC)",
    "DEN (Denver, CO)", "DFW (Dallas, TX)", "DTW (Detroit, MI)",
    "EWR (Newark, NJ)", "IAD (Washington, DC)", "JFK (New York, NY)",
    "LAX (Los Angeles, CA)", "LGA (New York, NY)", "MIA (Miami, FL)",
    "OAK (Oakland, CA)", "ORD (Chicago, IL)", "PHL (Philadelphia, PA)",
    "SFO (San Francisco, CA)"];

  const search = () => {
    const str_date = "2022-" + ((flightDate.getMonth() + 1).toString().length === 1 ? "0" : "") + (flightDate.getMonth() + 1) + (flightDate.getDate().toString().length === 1 ? "-0" : "-") + flightDate.getDate();
    fetch(`http://${config.server_host}:${config.server_port}/oneway_hotel?startap=${start}` +
      `&destap=${end}&duration=${duration}&date=${str_date}`
    )
      .then(res => res.json())
      .then(resJson => {
        // DataGrid expects an array of objects with a unique id.
        // To accomplish this, we use a map with spread syntax (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax)
        const songsWithId = resJson.map((trip) => ({ id: trip.id, ...trip }));
        setData(songsWithId);
      });
  }

  // This defines the columns of the table of songs used by the DataGrid component.
  // The format of the columns array and the DataGrid component itself is very similar to our
  // LazyTable component. The big difference is we provide all data to the DataGrid component
  // instead of loading only the data we need (which is necessary in order to be able to sort by column)
  const columns = [
    { field: 'airlineName', headerName: 'Airline' ,width:150 },
    { field: 'depTime', headerName: 'Departure Time',width:150 },
    { field: 'arrivalTime', headerName: 'Arrival Time' ,width:150},
    { field: 'flightPirce', headerName: 'Flight Price',width:150 },
    { field: 'hotel_name', headerName: 'Hotel',width:150, 
      // renderCell: (row) => <Link onClick={() => setSelectedHotelId(row.hotel_id)}>{row.name}</Link>
    },
    { field: 'hotel_address', headerName: 'Address',width:150 },
    { field: 'hotel_price', headerName: 'Hotel Price',width:150 },
    { field: 'total_price', headerName: 'Total Price' ,width:150},
  ]

  // This component makes uses of the Grid component from MUI (https://mui.com/material-ui/react-grid/).
  // The Grid component is super simple way to create a page layout. Simply make a <Grid container> tag
  // (optionally has spacing prop that specifies the distance between grid items). Then, enclose whatever
  // component you want in a <Grid item xs={}> tag where xs is a number between 1 and 12. Each row of the
  // grid is 12 units wide and the xs attribute specifies how many units the grid item is. So if you want
  // two grid items of the same size on the same row, define two grid items with xs={6}. The Grid container
  // will automatically lay out all the grid items into rows based on their xs values.
  return (
    <Container>
      {selectedHotelId && <HotelCard hotel_id={selectedHotelId} handleClose={() => setSelectedHotelId(null)} />}
      <h2>Search Trips</h2>
      <Grid container spacing={6}>
          <Grid item xs={3}>
            <Autocomplete
              autoSelect
              onInputChange={(e, value) => {
                  setStart(value.split(" ")[0]);
                }}
              options={airports}
              renderInput={(params) => <TextField {...params} label='Flying From' />}
              sx={{ width: "100%" }}/>
          </Grid>
          <Grid item xs={3}>
          <Autocomplete
              autoSelect
              onInputChange={(e, value) => {
                  setEnd(value.split(" ")[0]);
                }}
              options={airports}
              renderInput={(params) => <TextField {...params} label='Flying To' />}
              sx={{ width: "100%" }}/>
          </Grid>
        <Grid item xs={3}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker label='Flight Date'
              value={dayjs(flightDate)}
              onChange={(newValue) => {
                  setFlightDate(newValue.toDate());
              }}
              format={"YYYY-MM-DD"}
              minDate={dayjs("2022-04-17")}
              maxDate={dayjs("2022-11-19")}/>
          </LocalizationProvider>
        </Grid>
        <Grid item xs={3}>
          <TextField label='Duration' value={duration} onChange={(e) => setDuration(e.target.value)} style={{ width: "100%" }}/>
        </Grid>
      </Grid>
      <Button onClick={() => search() } style={{ left: '50%', transform: 'translateX(-50%)' }}>
        Search
      </Button>
      <h2>Results</h2>
      {/* Notice how similar the DataGrid component is to our LazyTable! What are the differences? */}
      <DataGrid
        rows={data}
        columns={columns}
        pageSize={pageSize}
        rowsPerPageOptions={[5, 10, 25]}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        autoHeight
      />
    </Container>
  );
}
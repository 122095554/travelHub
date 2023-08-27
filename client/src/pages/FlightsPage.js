import { useEffect, useState } from 'react';
import { Button, ToggleButton, ToggleButtonGroup, Container, Select, Grid, Link, Slider, TextField, Autocomplete, Typography, Box, CircularProgress, MenuItem, InputLabel } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs, { Dayjs } from 'dayjs';

import FlightCard from '../components/FlightCard';
import ConfirmationCard from '../components/ConfirmationCard';

const config = require('../config.json');
let date = new Date("2022-04-20")

export default function FlightsPage() {
  const [pageSize, setPageSize] = useState(10);
  const [data, setData] = useState([]);
  const [selectedTripId, setSelectedTripId] = useState(null);

  const [departFrom, setDepartFrom] = useState('PHL');
  const [arriveAt, setArriveAt] = useState('LAX');
  const [flightDate, setFlightDate] = useState(date);
  const [returnFlightDate, setReturnFlightDate] = useState(date);
  const [returnFlight, setReturnFlight] = useState(false);
  const [selection, setSelection] = useState(null);
  const [price, setPrice] = useState([0, 2000]);
  const [travellers, setTravellers] = useState(1);
  const [stops, setStops] = useState(0);
  const [tripType, setTripType] = useState('one-way');
  const [oneway, setOneWay] = useState(false);
  const [onewayFare, setOneWayFare] = useState(false);
  const [loading, setLoading] = useState(false);
  const [confirmedTripId, setConfirmedTripId] = useState(null);


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

  const img_dict = {
      "Delta": "https://nationaldmo.org/wp-content/uploads/2019/05/delta-logo.png",
      "American Airlines": "https://s21.q4cdn.com/616071541/files/multimedia-gallery/assets/Logos/american-airlines/THUMB-aa_aa__vrt_rgb_grd_pos.png",
      "JetBlue Airways": "https://download.logo.wine/logo/JetBlue/JetBlue-Logo.wine.png",
      "United": "https://theoagroup.org/wp-content/uploads/2021/11/united-airlines-logo-emblem-png-5.png",
      "Frontier Airlines": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Frontier_Airlines_logo.svg/2560px-Frontier_Airlines_logo.svg.png",
      "Alaska Airlines": "https://news.alaskaair.com/wp-content/uploads/2022/03/AS_Wordmark_Official_logo_rgb_midnight.png",
      "Spirit Airlines": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Spirit_Airlines_logo.svg/2560px-Spirit_Airlines_logo.svg.png"      
  }

  const search = () => {
    setLoading(true);
    const str_date = "2022-" + ((flightDate.getMonth() + 1).toString().length === 1 ? "0" : "") + (flightDate.getMonth() + 1) + (flightDate.getDate().toString().length === 1 ? "-0" : "-") + flightDate.getDate();

    fetch(`http://${config.server_host}:${config.server_port}/search_flights?` +
        `start_airport=${departFrom}&dest_airport=${arriveAt}` +
        `&departure_date=${str_date}&num_travellers=${travellers}&num_stops=${stops}` +
        `&price_low=${price[0]}&price_high=${price[1]}`
    )
        .then(res => res.json())
        .then(resJson => {
            const flightsWithId = resJson.map((flight) => (
                { 
                    id: flight.TripId,
                    airline: flight.Airline,
                    details: {
                        depart_from: flight.DepartFrom,
                        depart_date: flight.DepartureTime.split("T")[0],
                        depart_time: flight.DepartureTime.split("T")[1].split(".")[0],
                        arrive_at: flight.ArriveAt,
                        arrive_date: flight.ArrivalTime.split("T")[0],
                        arrive_time: flight.ArrivalTime.split("T")[1].split(".")[0]
                    },
                    first_stop: flight.FirstVia == null ? "No Stop" : {
                        arrive_at: flight.FirstVia,
                        arrive_date: flight.FirstConnectingArrivalTime.split("T")[0],
                        arrive_time: flight.FirstConnectingArrivalTime.split("T")[1].split(".")[0],
                        layover: flight.FirstLayover,
                        depart_date: flight.FirstConnectingDepartureTime.split("T")[0],
                        depart_time: flight.FirstConnectingDepartureTime.split("T")[1].split(".")[0]
                    },
                    second_stop: flight.SecondVia == null ? "No Stop" : {
                        arrive_at: flight.SecondVia,
                        arrive_date: flight.SecondConnectingArrivalTime.split("T")[0],
                        arrive_time: flight.SecondConnectingArrivalTime.split("T")[1].split(".")[0],
                        layover: flight.SecondLayover,
                        depart_date: flight.SecondConnectingDepartureTime.split("T")[0],
                        depart_time: flight.SecondConnectingDepartureTime.split("T")[1].split(".")[0] 
                    },
                    total_time: flight.TotalTime,
                    fare: flight.Fare
                }
            ));
            console.log(flightsWithId);
            setData(flightsWithId);
            setLoading(false);
        });
    }

    const searchReturn = () => {
        setLoading(true);
        const str_date = "2022-" + ((returnFlightDate.getMonth() + 1).toString().length === 1 ? "0" : "") + (returnFlightDate.getMonth() + 1) + (returnFlightDate.getDate().toString().length === 1 ? "-0" : "-") + returnFlightDate.getDate();
    
        fetch(`http://${config.server_host}:${config.server_port}/search_flights?` +
            `start_airport=${arriveAt}&dest_airport=${departFrom}` +
            `&departure_date=${str_date}&num_travellers=${travellers}&num_stops=${stops}` +
            `&price_low=${price[0]-onewayFare < 0 ? 0 : price[0]-onewayFare}&price_high=${price[1]-onewayFare < 0 ? 0 : price[1]-onewayFare}`
        )
            .then(res => res.json())
            .then(resJson => {
                const flightsWithId = resJson.map((flight) => (
                    { 
                        id: flight.TripId,
                        airline: flight.Airline,
                        details: {
                            depart_from: flight.DepartFrom,
                            depart_date: flight.DepartureTime.split("T")[0],
                            depart_time: flight.DepartureTime.split("T")[1].split(".")[0],
                            arrive_at: flight.ArriveAt,
                            arrive_date: flight.ArrivalTime.split("T")[0],
                            arrive_time: flight.ArrivalTime.split("T")[1].split(".")[0]
                        },
                        first_stop: flight.FirstVia == null ? "No Stop" : {
                            arrive_at: flight.FirstVia,
                            arrive_date: flight.FirstConnectingArrivalTime.split("T")[0],
                            arrive_time: flight.FirstConnectingArrivalTime.split("T")[1].split(".")[0],
                            layover: flight.FirstLayover,
                            depart_date: flight.FirstConnectingDepartureTime.split("T")[0],
                            depart_time: flight.FirstConnectingDepartureTime.split("T")[1].split(".")[0]
                        },
                        second_stop: flight.SecondVia == null ? "No Stop" : {
                            arrive_at: flight.SecondVia,
                            arrive_date: flight.SecondConnectingArrivalTime.split("T")[0],
                            arrive_time: flight.SecondConnectingArrivalTime.split("T")[1].split(".")[0],
                            layover: flight.SecondLayover,
                            depart_date: flight.SecondConnectingDepartureTime.split("T")[0],
                            depart_time: flight.SecondConnectingDepartureTime.split("T")[1].split(".")[0] 
                        },
                        total_time: flight.TotalTime,
                        fare: flight.Fare
                    }
                ));
                console.log(tripType);
                setData(flightsWithId);
                setLoading(false);
            });
        }

  const columns = [
    { field: 'airline', headerName: 'Airline', width: 150, renderCell: (params) => (
        <div>
            <Typography>
                <img
                    src={img_dict[params.value]}
                    width = "75" 
                    height = "75"
                />
            </Typography>
        </div>
    ) },
    { field: 'details', headerName: 'Flight Details', width: 220, renderCell: (params) => (
        <div>
            <Typography>{"Depart " + params.value.depart_from + ": " + params.value.depart_time.split(":")[0] + ":" + params.value.depart_time.split(":")[1]}</Typography>
            <Typography>{"Arrive " + params.value.arrive_at + ": " + params.value.arrive_time.split(":")[0] + ":" + params.value.arrive_time.split(":")[1] + (params.value.depart_date === params.value.arrive_date ? "" : " (+1)") }</Typography>
      </div>
    ) },
    { field: 'first_stop', headerName: 'First Stop', width: 220, renderCell: (params) => (
        <div>
            <Typography>{params.value === "No Stop" ? "" : (params.value.layover.split(":")[0] + "h " + params.value.layover.split(":")[1] + "m layover")}</Typography>
            <Typography>{params.value === "No Stop" ? "" : ("at " + params.value.arrive_at)}</Typography>
      </div>
    ) },
    { field: 'second_stop', headerName: 'Second Stop', width: 220, renderCell: (params) => (
        <div>
            <Typography>{params.value === "No Stop" ? "" : (params.value.layover.split(":")[0] + "h " + params.value.layover.split(":")[1] + "m layover")}</Typography>
            <Typography>{params.value === "No Stop" ? "" : ("at " + params.value.arrive_at)}</Typography>
      </div>
    ) },
    { field: 'total_time', headerName: 'Travel Time', width: 200, renderCell: (params) => (
        <div>
            <Typography>{params.value.split(":")[0] + " hours " + params.value.split(":")[1] + " minutes"}</Typography>
      </div>
    ) },
    { field: 'fare', headerName: 'Fare', width: 140, renderCell: (params) => (
        <div>
            <Typography><Link onClick={() => {
                 setOneWayFare(parseFloat(params.value));
                 setSelectedTripId(params.row.id);
                }}>
                     {"$" + Math.ceil(parseFloat(params.value))}</Link></Typography>
            <Typography>per traveller</Typography>
      </div>
    ) },
  ]

  const airports = ["ATL (Atlanta, GA)", "BOS (Boston, MA)", "CLT (Charlotte, NC)",
                    "DEN (Denver, CO)", "DFW (Dallas, TX)", "DTW (Detroit, MI)",
                    "EWR (Newark, NJ)", "IAD (Washington, DC)", "JFK (New York, NY)",
                    "LAX (Los Angeles, CA)", "LGA (New York, NY)", "MIA (Miami, FL)",
                    "OAK (Oakland, CA)", "ORD (Chicago, IL)", "PHL (Philadelphia, PA)",
                    "SFO (San Francisco, CA)"];

  const airport_dict = {"ATL": "Atlanta, GA", "BOS": "Boston, MA", "CLT": "Charlotte, NC",
                    "DEN": "Denver, CO", "DFW": "Dallas, TX", "DTW": "Detroit, MI",
                    "EWR": "Newark, NJ", "IAD": "Washington, DC", "JFK": "New York, NY",
                    "LAX": "Los Angeles, CA", "LGA": "New York, NY", "MIA": "Miami, FL",
                    "OAK": "Oakland, CA", "ORD": "Chicago, IL", "PHL": "Philadelphia, PA",
                    "SFO": "San Francisco, CA"};

  const stop_marks = [{value: 0, label: "Non-Stop"}, {value: 1, label: "1 Stop"}, {value: 2, label: "2 Stops"}];

  const fare_marks = [{value: 0, label: "$0"}, {value: 2000, label: "$2000"}];

  const selectFlight = () => {
      if (tripType === "one-way" ) {
        setConfirmedTripId({outgoingId: selectedTripId, returningId: null});
      } else if (returnFlight) {
          selection.returningId = selectedTripId;
          setSelectedTripId(null);
          setConfirmedTripId(selection);
      } else {
          setReturnFlight(true);
          setSelectedTripId(null);
          setSelection({outgoingId: selectedTripId, returningId: null});
          searchReturn();
      }
    };

    function Redirect() {
        window.location="/";
    }
  
  return (
    <Container>
      {selectedTripId && <FlightCard tripId={selectedTripId} handleSelect={selectFlight} handleClose={() => setSelectedTripId(null)} icon={img_dict} travellers={travellers} />}
      {confirmedTripId && <ConfirmationCard tripId={confirmedTripId} handleClose={() => {setConfirmedTripId(null); Redirect();}} icon={img_dict} city={airport_dict} travellers={travellers} />}
      <h2>Search Flights</h2>
      <Grid container spacing={6}>
        <Grid item xs={3}>
          <Autocomplete
            autoSelect
            onInputChange={(e, value) => {
                setDepartFrom(value.split(" ")[0]);
              }}
            options={airports}
            renderInput={(params) => <TextField {...params} label='Flying From' />}
            sx={{ width: "100%" }}/>
        </Grid>
        <Grid item xs={3}>
          <Autocomplete
            autoSelect
            onInputChange={(e, value) => {
                setArriveAt(value.split(" ")[0]);
              }}
            options={airports}
            renderInput={(params) => <TextField {...params} label='Flying To' />}
            sx={{ width: "100%" }}/>
        </Grid>
        <Grid item xs={3}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker label='Departing Flight Date'
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
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker label='Returning Flight Date'
            disabled={!oneway}
            value={dayjs(returnFlightDate)}
            onChange={(newValue) => {
                setReturnFlightDate(newValue.toDate());
            }}
            format={"YYYY-MM-DD"}
            minDate={dayjs(flightDate)}
            maxDate={dayjs("2022-11-19")}/>
        </LocalizationProvider>
        </Grid>
        <Grid item xs={3}>
        <InputLabel id="trip_type">Trip Type</InputLabel>
        <ToggleButtonGroup
            color="primary"
            value={tripType}
            exclusive={true}
            onChange={(event, newValue) => {
                setTripType(newValue);
                setOneWay(tripType === "one-way");
            }}
            aria-label="Trip Type"
            >
            <ToggleButton value="one-way">One-Way</ToggleButton>
            <ToggleButton value="roundtrip">Roundtrip</ToggleButton>
        </ToggleButtonGroup>
        </Grid>
        <Grid item xs={2}>
        <InputLabel id="travellers">Travellers</InputLabel>
        <Select
            value={travellers}
            label="Travellers"
            onChange={(e) => {setTravellers(e.target.value)}}
        >
            <MenuItem value={1}>1</MenuItem>
            <MenuItem value={2}>2</MenuItem>
            <MenuItem value={3}>3</MenuItem>
            <MenuItem value={4}>4</MenuItem>
            <MenuItem value={5}>5</MenuItem>
            <MenuItem value={6}>6</MenuItem>
            <MenuItem value={7}>7</MenuItem>
            <MenuItem value={8}>8</MenuItem>
            <MenuItem value={9}>9</MenuItem>
            <MenuItem value={10}>10</MenuItem>
        </Select>
        </Grid>
        <Grid item xs={3}>
        <InputLabel id="stops">Maximum Stops</InputLabel>
        <Slider
            aria-label="Stops"
            defaultValue={stops}
            onChange={(e, newValue) => {setStops(newValue)}}
            step={1}
            valueLabelDisplay="auto"
            marks={stop_marks}
            min={0}
            max={2}
        />
        </Grid>
        <Grid item xs={3}>
        <InputLabel id="fare_range">Fare Range (Per Traveller)</InputLabel>
        <Slider
            aria-label="Fare"
            value={price}
            min={0}
            max={2000}
            step={50}
            onChange={(e, newValue) => setPrice(newValue)}
            valueLabelDisplay='auto'
            marks={fare_marks}
        />
        </Grid>
      </Grid>
      <Box sx={{ m: 1 }} />
      <AdornedButton loading={loading} onClick={() => {
          setReturnFlight(false);
          setSelectedTripId(null);
          setConfirmedTripId(null);
          search();
          }} style={{ left: '50%', transform: 'translateX(-50%)' }}>
        Search Flights
      </AdornedButton>
      <h2>{tripType === "one-way" ? "Select Flight" : (returnFlight ? "Select Returning Flight" : "Select Outgoing Flight")}</h2>
      <DataGrid
        rows={data}
        columns={columns}
        rowHeight={100}
        pageSize={pageSize}
        rowsPerPageOptions={[5, 10, 25]}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        autoHeight
      />
      <Box sx={{ m: 4 }} />
    </Container>
  );
}
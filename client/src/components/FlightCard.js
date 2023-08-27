import { useEffect, useState } from 'react';
import { Box, Button, ButtonGroup, Link, Modal } from '@mui/material';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';
import { NavLink } from 'react-router-dom';

const config = require('../config.json');

export default function FlightCard({ tripId, handleSelect, handleClose, icon, travellers }) {
  const [tripData, setTripData] = useState([]);

  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/multileg_flights?legIds=${tripId}`)
      .then(res => res.json())
      .then(resJson => {
        const flightsWithId = resJson.map((flight) => ({ id: flight.legId, ...flight }));
        setTripData(flightsWithId);
    })
  }, [tripId]);


  return (
    <Modal
      open={true}
      onClose={handleClose}
      style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
    >
      <Box
        p={3}
        style={{ background: 'white', borderRadius: '16px', border: '2px solid #000', width: 600 }}
      >
        <p>
        <img
            src={icon[tripData[0] ? tripData[0].segmentsAirlineName : '']}
            width = "100" 
            height = "100"
        />
        </p>
        <h2>
            {(tripData[0] ? tripData[0].segmentsAirlineName : '') + " "}
        </h2>
        <p><em>Date: {(tripData[0] ? tripData[0].segmentsDepartureTimeRaw.split("T")[0] : '') + (tripData[0] ? (tripData[0].segmentsEquipmentDescription ? ", Aircraft: " + tripData[0].segmentsEquipmentDescription : '') : '')}</em></p>
        <p>Flying From: <strong>{tripData[0] ? tripData[0].startingAirport : null}</strong> at <strong>{tripData[0] ? tripData[0].segmentsDepartureTimeRaw.split("T")[1].split(".")[0] : null}</strong></p>
        <p>Arriving At: <strong>{tripData[0] ? tripData[0].destinationAirport : null}</strong> at <strong>{tripData[0] ? tripData[0].segmentsArrivalTimeRaw.split("T")[1].split(".")[0] : null}</strong></p>

        <p>{tripData[1] ? "----" : ''}</p>

        <p><em>{(tripData[1] ? "Date: " + tripData[1].segmentsDepartureTimeRaw.split("T")[0] : '') + (tripData[1] ? (tripData[1].segmentsEquipmentDescription ? ", Aircraft: " + tripData[1].segmentsEquipmentDescription : '') : '')}</em></p>
        <p>{tripData[1] ? "Flying From: " : ''} <strong>{tripData[1] ? tripData[1].startingAirport : ''}</strong> {tripData[1] ? " at " : ''} <strong>{tripData[1] ? tripData[1].segmentsDepartureTimeRaw.split("T")[1].split(".")[0] : ''}</strong></p>
        <p>{tripData[1] ? "Arriving At: " : ''} <strong>{tripData[1] ? tripData[1].destinationAirport : null}</strong> {tripData[1] ? " at " : ''} <strong>{tripData[1] ? tripData[1].segmentsArrivalTimeRaw.split("T")[1].split(".")[0] : null}</strong></p>

        <p>{tripData[2] ? "----" : ''}</p>

        <p><em>{(tripData[2] ? "Date: " + tripData[2].segmentsDepartureTimeRaw.split("T")[0] : '') + (tripData[2] ? (tripData[2].segmentsEquipmentDescription ? ", Aircraft: " + tripData[2].segmentsEquipmentDescription : '') : '')}</em></p>
        <p>{tripData[2] ? "Flying From: " : ''} <strong>{tripData[2] ? tripData[2].startingAirport : ''}</strong> {tripData[2] ? " at " : ''} <strong>{tripData[2] ? tripData[2].segmentsDepartureTimeRaw.split("T")[1].split(".")[0] : ''}</strong></p>
        <p>{tripData[2] ? "Arriving At: " : ''} <strong>{tripData[2] ? tripData[2].destinationAirport : null}</strong> {tripData[2] ? " at " : ''} <strong>{tripData[2] ? tripData[2].segmentsArrivalTimeRaw.split("T")[1].split(".")[0] : null}</strong></p>
        <br></br>

        <p>Base Fare: ${Math.round(((tripData[0] ? parseFloat(tripData[0].baseFare) : 0) + (tripData[1] ? parseFloat(tripData[1].baseFare) : 0) + (tripData[2] ? parseFloat(tripData[2].baseFare) : 0)) * travellers * 100) / 100}</p>
        <h3>Total Fare: ${Math.round(((tripData[0] ? parseFloat(tripData[0].totalFare) : 0) + (tripData[1] ? parseFloat(tripData[1].totalFare) : 0) + (tripData[2] ? parseFloat(tripData[2].totalFare) : 0)) * travellers * 100) / 100}</h3>
    
        <Button onClick={handleSelect} style={{ left: '50%', transform: 'translateX(-50%)' }} >
          Select This Flight
        </Button>
        <Button onClick={handleClose} style={{ left: '50%', transform: 'translateX(-50%)' }} >
          Close
        </Button>
      </Box>
    </Modal>
  );
}

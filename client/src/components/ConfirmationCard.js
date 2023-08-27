import { useEffect, useState } from 'react';
import { Box, Button, ButtonGroup, Link, Modal } from '@mui/material';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';
import { NavLink } from 'react-router-dom';

const config = require('../config.json');

export default function ConfirmationCard({ tripId, handleClose, icon, city, travellers }) {
  const [outgoingTripData, setOutgoingTripData] = useState([]);
  const [returningTripData, setReturningTripData] = useState([]);
  const outgoingId = tripId.outgoingId;
  const returningId = tripId.returningId;

  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/multileg_flights?legIds=${outgoingId}`)
      .then(res => res.json())
      .then(resJson => {
        const flightsWithId = resJson.map((flight) => ({ id: flight.legId, ...flight }));
        setOutgoingTripData(flightsWithId);
        if (returningId) {
            fetch(`http://${config.server_host}:${config.server_port}/multileg_flights?legIds=${returningId}`)
            .then(res => res.json())
            .then(resJson => {
                const flightsWithId = resJson.map((flight) => ({ id: flight.legId, ...flight }));
                setReturningTripData(flightsWithId);
            })
        }
    })
  }, [tripId]);

  return (
    <Modal
      open={true}
      onClose={handleClose}
      style={{ display: 'grid', justifyContent: 'center', alignItems: 'center', overflow:'scroll' }}
    >
      <Box
        p={3}
        style={{ background: 'white', borderRadius: '16px', border: '2px solid #000', width: 600 }}
      >
    
        <h2>
            {(outgoingTripData[0] ? "You are flying to " + city[outgoingTripData[0].destinationAirport] + "!" : "")}
        </h2>
        <h3>Trip Details:</h3>
        <h4>{(returningTripData[0] ? "Outgoing Trip:" : "")}</h4>
        <p>
        <img
            src={icon[outgoingTripData[0] ? outgoingTripData[0].segmentsAirlineName : '']}
            width = "100" 
            height = "100"
        />
        </p>
        <p><em>Date: {(outgoingTripData[0] ? outgoingTripData[0].segmentsDepartureTimeRaw.split("T")[0] : '') + (outgoingTripData[0] ? (outgoingTripData[0].segmentsEquipmentDescription ? ", Aircraft: " + outgoingTripData[0].segmentsEquipmentDescription : '') : '')}</em></p>
        <p>Flying From: <strong>{outgoingTripData[0] ? outgoingTripData[0].startingAirport : null}</strong> at <strong>{outgoingTripData[0] ? outgoingTripData[0].segmentsDepartureTimeRaw.split("T")[1].split(".")[0] : null}</strong></p>
        <p>Arriving At: <strong>{outgoingTripData[0] ? outgoingTripData[0].destinationAirport : null}</strong> at <strong>{outgoingTripData[0] ? outgoingTripData[0].segmentsArrivalTimeRaw.split("T")[1].split(".")[0] : null}</strong></p>

        <p>{outgoingTripData[1] ? "----" : ''}</p>

        <p><em>{(outgoingTripData[1] ? "Date: " + outgoingTripData[1].segmentsDepartureTimeRaw.split("T")[0] : '') + (outgoingTripData[1] ? (outgoingTripData[1].segmentsEquipmentDescription ? ", Aircraft: " + outgoingTripData[1].segmentsEquipmentDescription : '') : '')}</em></p>
        <p>{outgoingTripData[1] ? "Flying From: " : ''} <strong>{outgoingTripData[1] ? outgoingTripData[1].startingAirport : ''}</strong> {outgoingTripData[1] ? " at " : ''} <strong>{outgoingTripData[1] ? outgoingTripData[1].segmentsDepartureTimeRaw.split("T")[1].split(".")[0] : ''}</strong></p>
        <p>{outgoingTripData[1] ? "Arriving At: " : ''} <strong>{outgoingTripData[1] ? outgoingTripData[1].destinationAirport : null}</strong> {outgoingTripData[1] ? " at " : ''} <strong>{outgoingTripData[1] ? outgoingTripData[1].segmentsArrivalTimeRaw.split("T")[1].split(".")[0] : null}</strong></p>

        <p>{outgoingTripData[2] ? "----" : ''}</p>

        <p><em>{(outgoingTripData[2] ? "Date: " + outgoingTripData[2].segmentsDepartureTimeRaw.split("T")[0] : '') + (outgoingTripData[2] ? (outgoingTripData[2].segmentsEquipmentDescription ? ", Aircraft: " + outgoingTripData[2].segmentsEquipmentDescription : '') : '')}</em></p>
        <p>{outgoingTripData[2] ? "Flying From: " : ''} <strong>{outgoingTripData[2] ? outgoingTripData[2].startingAirport : ''}</strong> {outgoingTripData[2] ? " at " : ''} <strong>{outgoingTripData[2] ? outgoingTripData[2].segmentsDepartureTimeRaw.split("T")[1].split(".")[0] : ''}</strong></p>
        <p>{outgoingTripData[2] ? "Arriving At: " : ''} <strong>{outgoingTripData[2] ? outgoingTripData[2].destinationAirport : null}</strong> {outgoingTripData[2] ? " at " : ''} <strong>{outgoingTripData[2] ? outgoingTripData[2].segmentsArrivalTimeRaw.split("T")[1].split(".")[0] : null}</strong></p>

        <h4>{(returningTripData[0] ? "Returning Trip:" : "")}</h4>
        <p>
        <img
            src={icon[returningTripData[0] ? returningTripData[0].segmentsAirlineName : '']}
            width = {returningTripData[0] ? "100" : "0" }
            height = {returningTripData[0] ? "100" : "0" }
        />
        </p>
        <p><em>{(returningTripData[0] ? "Date: " + returningTripData[0].segmentsDepartureTimeRaw.split("T")[0] : '') + (returningTripData[0] ? (returningTripData[0].segmentsEquipmentDescription ? ", Aircraft: " + returningTripData[0].segmentsEquipmentDescription : '') : '')}</em></p>
        <p>{returningTripData[0] ? "Flying From: " : ''} <strong>{returningTripData[0] ? returningTripData[0].startingAirport : ''}</strong> {returningTripData[0] ? " at " : ''} <strong>{returningTripData[0] ? returningTripData[0].segmentsDepartureTimeRaw.split("T")[1].split(".")[0] : ''}</strong></p>
        <p>{returningTripData[0] ? "Arriving At: " : ''} <strong>{returningTripData[0] ? returningTripData[0].destinationAirport : ''}</strong> {returningTripData[0] ? " at " : ''} <strong>{returningTripData[0] ? returningTripData[0].segmentsArrivalTimeRaw.split("T")[1].split(".")[0] : ''}</strong></p>

        <p>{returningTripData[1] ? "----" : ''}</p>

        <p><em>{(returningTripData[1] ? "Date: " + returningTripData[1].segmentsDepartureTimeRaw.split("T")[0] : '') + (returningTripData[1] ? (returningTripData[1].segmentsEquipmentDescription ? ", Aircraft: " + returningTripData[1].segmentsEquipmentDescription : '') : '')}</em></p>
        <p>{returningTripData[1] ? "Flying From: " : ''} <strong>{returningTripData[1] ? returningTripData[1].startingAirport : ''}</strong> {returningTripData[1] ? " at " : ''} <strong>{returningTripData[1] ? returningTripData[1].segmentsDepartureTimeRaw.split("T")[1].split(".")[0] : ''}</strong></p>
        <p>{returningTripData[1] ? "Arriving At: " : ''} <strong>{returningTripData[1] ? returningTripData[1].destinationAirport : ''}</strong> {returningTripData[1] ? " at " : ''} <strong>{returningTripData[1] ? returningTripData[1].segmentsArrivalTimeRaw.split("T")[1].split(".")[0] : ''}</strong></p>

        <p>{returningTripData[2] ? "----" : ''}</p>

        <p><em>{(returningTripData[2] ? "Date: " + returningTripData[2].segmentsDepartureTimeRaw.split("T")[0] : '') + (returningTripData[2] ? (returningTripData[2].segmentsEquipmentDescription ? ", Aircraft: " + returningTripData[2].segmentsEquipmentDescription : '') : '')}</em></p>
        <p>{returningTripData[2] ? "Flying From: " : ''} <strong>{returningTripData[2] ? returningTripData[2].startingAirport : ''}</strong> {returningTripData[2] ? " at " : ''} <strong>{returningTripData[2] ? returningTripData[2].segmentsDepartureTimeRaw.split("T")[1].split(".")[0] : ''}</strong></p>
        <p>{returningTripData[2] ? "Arriving At: " : ''} <strong>{returningTripData[2] ? returningTripData[2].destinationAirport : ''}</strong> {returningTripData[2] ? " at " : ''} <strong>{returningTripData[2] ? returningTripData[2].segmentsArrivalTimeRaw.split("T")[1].split(".")[0] : ''}</strong></p>
        <br></br>

        <h3>You will pay: ${Math.round(((outgoingTripData[0] ? parseFloat(outgoingTripData[0].totalFare) : 0) + (outgoingTripData[1] ? parseFloat(outgoingTripData[1].totalFare) : 0) + (outgoingTripData[2] ? parseFloat(outgoingTripData[2].totalFare) : 0) + 
                            (returningTripData[0] ? parseFloat(returningTripData[0].totalFare) : 0) + (returningTripData[1] ? parseFloat(returningTripData[1].totalFare) : 0) + (returningTripData[2] ? parseFloat(returningTripData[2].totalFare) : 0)) * travellers * 100) / 100}</h3>
    
        <Button onClick={handleClose} style={{ left: '50%', transform: 'translateX(-50%)' }} >
          Close
        </Button>
      </Box>
    </Modal>
  );
}

import { useEffect, useState } from 'react';
import { Box, Button, ButtonGroup, Link, Modal } from '@mui/material';
const config = require('../config.json');

export default function AirbnbCard({ airbnb_id, handleClose }) {
  const [airbnbData, setAirbnbData] = useState({});

  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/airbnb/${airbnb_id}`)
      .then(res => res.json())
      .then(resJson => setAirbnbData(resJson)); 
  }, [airbnb_id]);

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
        <h1>{airbnbData.airbnb_name}</h1>
        <p>Price: {airbnbData.price}</p>
        <p>City: {airbnbData.city}</p>
        <p>Neighbourhood: {airbnbData.neighbourhood_name}</p>
        <p>Room Type: {airbnbData.room_type}</p>
        <p>Mininum Nights: {airbnbData.minimum_nights}</p>
        <Button onClick={handleClose} style={{ left: '50%', transform: 'translateX(-50%)' }} >
          Close
        </Button>
      </Box>
    </Modal>
  );
}
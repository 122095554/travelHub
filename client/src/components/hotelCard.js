import { useEffect, useState } from 'react';
import { Box, Button, ButtonGroup, Link, Modal } from '@mui/material';
const config = require('../config.json');

export default function HotelCard({ hotel_id, handleClose }) {
  const [hotelData, setHotelData] = useState({});

  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/hotels/${hotel_id}`)
      .then(res => res.json())
      .then(resJson => setHotelData(resJson)); 
  }, [hotel_id]);

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
        <h1>{hotelData.name}</h1>
        <p>Price: {hotelData.price}</p>
        <p>Address: {hotelData.address}</p>
        <p>City: {hotelData.city}</p>
        <p>Province: {hotelData.province}</p>
        <p>Postal Code: {hotelData.postal_code}</p>
        <p>Rating: {hotelData.rating}</p>
        <Button onClick={handleClose} style={{ left: '50%', transform: 'translateX(-50%)' }} >
          Close
        </Button>
      </Box>
    </Modal>
  );
}
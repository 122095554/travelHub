import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

const config = require('../config.json');

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    fontFamily: "sans-serif",
    backgroundColor: "#f8f8f8"
  },
  card: {
    width: 400,
    padding: 24,
    borderRadius: 8,
    backgroundColor: "#ffffff",
    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)"
  },
  title: {
    margin: 0,
    fontSize: 28,
    fontWeight: "bold",
    color: "#333333",
    textAlign: "center",
    marginBottom: 16
  },
  info: {
    margin: 0,
    fontSize: 18,
    color: "#666666",
    marginBottom: 8
  }
};

export default function AirbnbInfoPage() {
  const { airbnb_id } = useParams();

  const [airbnbData, setAirbnbData] = useState([{}]);

  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/airbnb/${airbnb_id}`)
      .then(res => res.json())
      .then(resJson => setAirbnbData(resJson));
  }, [airbnb_id]);

  return (
    <Container>
      <Stack direction='row' justify='center'>
        <Stack>
          <h1 style={{ fontSize: 32 }}>{airbnbData.airbnb_name}</h1>
        </Stack>
      </Stack>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell key='Price'>Price</TableCell>
              <TableCell key='City'>City</TableCell>
              <TableCell key='Neighbourhood'>Neighborhood</TableCell>
              <TableCell key='Room Type'>Room Type</TableCell>
              <TableCell key='Host'>Host</TableCell>
              <TableCell key='Minimum Nights'>Minimum Nights</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {
              // TODO (TASK 23): render the table content by mapping the songData array to <TableRow> elements
              // Hint: the skeleton code for the very first row is provided for you. Fill out the missing information and then use a map function to render the rest of the rows.
              // Hint: it may be useful to refer back to LazyTable.js
            <TableRow key={airbnbData.airbnb_id}>
                <TableCell key='Price'>${airbnbData.price}</TableCell>
                <TableCell key='City'>{airbnbData.city}</TableCell>
                <TableCell key='Neighbourhood'>{airbnbData.neighbourhood_name}</TableCell>
                <TableCell key='Room Type'>{airbnbData.room_type}</TableCell>
                <TableCell key='Host'>{airbnbData.host_name}</TableCell>
                <TableCell key='Minimum Nights'>{airbnbData.minimum_nights}</TableCell>
                {/* <TableCell key='Reviews'>
                <Link onClick={() => setSelectedSongId(song.song_id)}>
                    {song.title}
                </Link>
                </TableCell> */}
            </TableRow>
            }
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}
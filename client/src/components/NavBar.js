import { AppBar, Container, Toolbar, Typography } from '@mui/material'
import { NavLink } from 'react-router-dom';

// The hyperlinks in the NavBar contain a lot of repeated formatting code so a
// helper component NavText local to the file is defined to prevent repeated code.
const NavText = ({ href, text, isMain }) => {
  return (
    <Typography 
      variant={isMain ? 'h4' : 'h7'}
      noWrap
      style={{
        marginRight: '30px',
        fontFamily: 'monospace',
        fontWeight: 700,
        letterSpacing: '.3rem',
      }}
    >
      <NavLink
        to={href}
        style={{
          color: 'inherit',
          textDecoration: 'none',
        }}
      >
        {text}
      </NavLink>
    </Typography>
  )
}

// Here, we define the NavBar. Note that we heavily leverage MUI components
// to make the component look nice. Feel free to try changing the formatting
// props to how it changes the look of the component.
export default function NavBar() {
  return (
    <AppBar position='static' >
      <Container maxWidth='xl'>
      <img
            src={"https://www.pngall.com/wp-content/uploads/2/Travel-PNG-Image-HD.png"}
          />
        <Toolbar disableGutters style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}}>
          <NavText href='/deals' text='Deals'/>
          <NavText href='/' text='T R A V E L' isMain />
          <NavText href='/planner' text='Search' />
          <NavText href='/search_flights' text='Flights' />
        </Toolbar>
      </Container>
    </AppBar>
  );
}

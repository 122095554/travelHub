import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CssBaseline, ThemeProvider } from '@mui/material';

import { teal, amber } from '@mui/material/colors';
import { createTheme } from "@mui/material/styles";

import NavBar from './components/NavBar';
import HomePage from './pages/HomePage';
import DealsPage from './pages/DealsPage';
import PlannerPage from './pages/PlannerPage';
import AirbnbInfoPage from './pages/AirbnbInfoPage';
import CityPage from './pages/CityPage';
import FlightsPage from "./pages/FlightsPage";

// createTheme enables you to customize the look and feel of your app past the default
// in this case, we only change the color scheme
export const theme = createTheme({
  palette: {
    primary: teal,
    secondary: amber,
  },
  spacing: 12,
});

// App is the root component of our application and as children contain all our pages
// We use React Router's BrowserRouter and Routes components to define the pages for
// our application, with each Route component representing a page and the common
// NavBar component allowing us to navigate between pages (with hyperlinks)
export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/deals" element={<DealsPage />} />
          <Route path="/airbnb/:airbnb_id" element={<AirbnbInfoPage />} />
          <Route path="/city/:city" element={<CityPage />} />
          <Route path="/planner" element={<PlannerPage />} />
          <Route path="/search_flights" element={<FlightsPage />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

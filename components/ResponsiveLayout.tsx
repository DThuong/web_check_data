import Box from '@mui/material/Box';
import ResponsiveNavbar from './Navbar';
import ResponsiveFields from './Fields';
export default function ResponsiveLayout() {
  return (
    <Box>
      <ResponsiveNavbar />
      <ResponsiveFields />
      {/* component khác */}
    </Box>
  );
}
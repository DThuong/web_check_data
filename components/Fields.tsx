import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
const currencies = [
  { value: 'USD', label: '$' },
  { value: 'EUR', label: '€' },
  { value: 'BTC', label: '฿' },
  { value: 'JPY', label: '¥' },
];

export function ResponsiveFields() {
  return (
    <Box
      component="form"
      sx={{ 
        width: '100%',
        px: { xs: 2, sm: 3 }, // Padding ngang responsive
        py: 2,
      }}
      noValidate
      autoComplete="off"
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' }, // Stack vertical trên mobile
          gap: { xs: 2, sm: 2 }, // Khoảng cách giữa các field
          width: '100%',
        }}
      >
        {/* Scode Field */}
        <TextField
          id="outlined-select-currency"
          select
          label="Scode"
          defaultValue="EUR"
          helperText="Please select Scode"
          sx={{
            flex: 1,
            minWidth: { xs: '100%', sm: 200 }, // Full width trên mobile
          }}
        >
          {currencies.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>

        {/* Slot Field */}
        <TextField
          id="outlined-select-currency-native"
          select
          label="Slot"
          defaultValue="EUR"
          slotProps={{
            select: {
              native: true,
            },
          }}
          helperText="Please select Slot"
          sx={{
            flex: 1,
            minWidth: { xs: '100%', sm: 200 }, // Full width trên mobile
          }}
        >
          {currencies.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </TextField>
      </Box>
    </Box>
  );
}

export default ResponsiveFields;

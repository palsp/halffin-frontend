import { forwardRef } from 'react';
import { TextField, useTheme } from '@mui/material';

// import { makeStyles } from '@material-ui/core/styles';

// const useStyles = makeStyles((theme) => ({
//   input: {
//     backgroundColor: '#fff',
//   },
// }));

const CustomPhoneNumber = forwardRef((props, ref) => {
  // const classes = useStyles()
  const theme = useTheme();

  return (
    <TextField
      fullWidth
      required
      type="number"
      name="phoneNumber"
      label="Phone Number"
      margin="normal"
      {...props}
      sx={{ ...theme.typography.customInput }}
      inputRef={ref}
    />
  );
});

export default CustomPhoneNumber;

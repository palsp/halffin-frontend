import { Typography } from '@mui/material';
import Grid from '@mui/material/Grid';

const Detail = ({
  title,
  description,
  descriptionSx = {},
  color = 'white',
}) => {
  return (
    <Grid
      container
      direction="row"
      justifyContent="flex-start"
      alignItems="center"
      sx={{ padding: '6px', marginTop: '4px' }}
    >
      <Typography variant="h3" sx={{ color: color }}>
        {title}
      </Typography>
      <Typography variant="h5" sx={{ paddingLeft: '10px', color: color }}>
        {description}
      </Typography>
    </Grid>
  );
};

export default Detail;

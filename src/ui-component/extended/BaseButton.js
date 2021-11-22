import { Button } from '@mui/material';
const BaseButton = ({ children, onClick, sx = {} }) => (
  <Button
    size="small"
    type="button"
    size="large"
    variant="contained"
    color="primary"
    onClick={onClick}
    sx={sx}
  >
    {children}
  </Button>
);

export default BaseButton;

import PropTypes from "prop-types";
import {
  Dialog,
  DialogContent,
  CircularProgress,
  Typography,
  DialogActions,
  Button,
} from "@mui/material";
import ProgressBar from "ui-component/extended/ProgressBar";

const ProgressModal = ({
  open,
  steps,
  activeStep,
  error,
  errorComponent,
  components,
  isAbleToClose,
  onClose,
  style,
  sxProgessBar = {},
}) => {
  let progress = components[activeStep];
  if (error) {
    progress = errorComponent;
  } else if (!components[activeStep]) {
    progress = (
      <Typography sx={{mt: 2, mb: 1}} textAlign="center">
        <CircularProgress color="inherit" />
      </Typography>
    );
  }
  return (
    <Dialog open={open} maxWidth>
      <DialogContent style={style}>
        <ProgressBar
          sx={sxProgessBar}
          steps={steps}
          activeStep={activeStep}
          isError={index => error && activeStep === index}
        />
      </DialogContent>
      <div>{progress}</div>
      <DialogActions>
        <Button disabled={!isAbleToClose} onClick={onClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

ProgressModal.propTypes = {
  steps: PropTypes.arrayOf(PropTypes.string),
  activeStep: PropTypes.number,
};

export default ProgressModal;

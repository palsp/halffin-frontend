import PropTypes from "prop-types";
import {
  Dialog,
  Stepper,
  Box,
  Step,
  StepLabel,
  DialogContent,
  CircularProgress,
  Typography,
  DialogActions,
  Button,
} from "@mui/material";

const ProgressModal = ({
  open,
  steps,
  activeStep,
  error,
  errorComponent,
  components,
  isAbleToClose,
  onClose,
}) => {
  let progress = components[activeStep];
  if (error) {
    progress = errorComponent;
  } else if (!components[activeStep]) {
    progress = (
      <Typography sx={{ mt: 2, mb: 1 }} textAlign="center">
        <CircularProgress color="inherit" />
      </Typography>
    );
  }
  return (
    <Dialog open={open} maxWidth>
      <DialogContent>
        <Box sx={{ width: "100%", overflowY: "visible" }}>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label, index) => (
              <Step key={label}>
                <StepLabel error={error && activeStep === index}>
                  {label}
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>
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

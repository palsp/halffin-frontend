import { Box, Stepper, StepLabel, Step } from "@mui/material";

const ProgressBar = ({ activeStep, isError = () => false, steps }) => (
  <Box sx={{ width: "100%", overflowY: "visible" }}>
    <Stepper activeStep={activeStep} alternativeLabel>
      {steps.map((label, index) => (
        <Step key={label}>
          <StepLabel error={isError(index)}>{label}</StepLabel>
        </Step>
      ))}
    </Stepper>
  </Box>
);

export default ProgressBar;

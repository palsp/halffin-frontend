import {Box, Stepper, StepLabel, Step, useTheme} from '@mui/material';

const ProgressBar = ({activeStep, isError = () => false, steps, sx}) => {
  const theme = useTheme();
  return (
    <Box sx={{width: '100%', overflowY: 'visible'}}>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label, index) => (
          <Step key={label}>
            <StepLabel error={isError(index)}>
              <p style={{color: theme.palette.text.card, ...sx}}>{label}</p>
            </StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
};

export default ProgressBar;

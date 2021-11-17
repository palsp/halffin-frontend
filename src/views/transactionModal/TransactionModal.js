import ReactDOM from "react-dom";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Stepper,
  Step,
  StepButton,
  Grid,
  Typography,
} from "@mui/material";
import { useTx } from "hooks";
import Spinner from "ui-component/extended/Spinner";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
  txTag: {
    textDecoration: "none",
    color: theme.palette.primary.main,
    "&:hover": {
      color: theme.palette.secondary.main,
    },
  },
}));

const TransactionModal = () => {
  const classes = useStyles();
  const { txState, steps, isComplete, handleClose } = useTx();
  const { open, txhash, step } = txState;
  const dom = document.getElementById("tx-modal-overlay");
  return (
    <>
      {ReactDOM.createPortal(
        <Dialog open={open} maxWidth>
          <DialogContent>
            <Box sx={{ width: "100%" }}>
              <Stepper activeStep={step} alternativeLabel>
                {steps.map((label, index) => (
                  <Step key={label}>
                    <StepButton color="inherit">{label}</StepButton>
                  </Step>
                ))}
              </Stepper>
              <div>
                {isComplete() ? (
                  <Grid
                    container
                    direction="column"
                    justifyContent="center"
                    alignItems="center"
                  >
                    <Typography sx={{ mt: 2, mb: 1 }} variant="h3">
                      Request Complete
                    </Typography>
                    <Typography sx={{ mt: 2, mb: 1 }} variant="body1">
                      Your product has been created.
                    </Typography>
                    <Typography
                      sx={{ mt: 2, mb: 1 }}
                      variant="body2"
                      style={{
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        display: "inherit",
                      }}
                    >
                      Transaction hash :{" "}
                      <a
                        className={classes.txTag}
                        href={`https://kovan.etherscan.io/tx/${txhash}`}
                        target="_blank"
                      >
                        {txhash}
                      </a>
                    </Typography>
                  </Grid>
                ) : (
                  <>
                    <Typography sx={{ mt: 2, mb: 1 }} textAlign="center">
                      <Spinner />
                    </Typography>
                  </>
                )}
              </div>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button disabled={step === 1} onClick={handleClose}>
              Close
            </Button>
          </DialogActions>
        </Dialog>,
        dom
      )}
    </>
  );
};

export default TransactionModal;

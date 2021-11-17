import ReactDOM from "react-dom";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Stepper,
  Step,
  StepLabel,
  Grid,
  Typography,
  CircularProgress,
} from "@mui/material";
import { useTx, useWeb3 } from "hooks";
import { makeStyles } from "@mui/styles";
import {
  shortenIfTransactionHash,
  getExplorerTransactionLink,
} from "@usedapp/core";

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
  const { chainId } = useWeb3();
  const { txState, steps, isComplete, handleClose } = useTx();
  const { open, txhash, step, error, errorMessage } = txState;
  const dom = document.getElementById("tx-modal-overlay");
  return (
    <>
      {ReactDOM.createPortal(
        <Dialog open={open} maxWidth>
          <DialogContent>
            <Box sx={{ width: "100%", overflowY: "visible" }}>
              <Stepper activeStep={step} alternativeLabel>
                {steps.map((label, index) => {
                  const labelProps = {};
                  if (error && step === index) {
                    labelProps.error = true;
                  }
                  return (
                    <Step key={label}>
                      <StepLabel {...labelProps}>{label}</StepLabel>
                    </Step>
                  );
                })}
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
                        href={getExplorerTransactionLink(txhash, chainId)}
                        target="_blank"
                      >
                        {shortenIfTransactionHash(txhash)}
                      </a>
                    </Typography>
                  </Grid>
                ) : error ? (
                  <Typography
                    sx={{ mt: 2, mb: 1 }}
                    textAlign="center"
                    sx={{ color: "red", fontWeight: "bold" }}
                  >
                    {errorMessage}
                  </Typography>
                ) : (
                  <Typography sx={{ mt: 2, mb: 1 }} textAlign="center">
                    <CircularProgress color="inherit" />
                  </Typography>
                )}
              </div>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button disabled={!error && !isComplete()} onClick={handleClose}>
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
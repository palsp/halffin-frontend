import ReactDOM from 'react-dom';
import { Grid, Typography, CircularProgress } from '@mui/material';
import { useWeb3 } from 'hooks';
import { makeStyles } from '@mui/styles';
import {
  shortenIfTransactionHash,
  getExplorerTransactionLink,
} from '@usedapp/core';
import ProgressModal from '../ProgressModal';

const useStyles = makeStyles((theme) => ({
  txTag: {
    textDecoration: 'none',
    color: theme.palette.primary,
    '&:hover': {
      color: theme.palette.secondary.main,
    },
  },
}));

const TransactionModal = ({
  open,
  txhash,
  steps,
  error,
  errorComponent,
  activeStep,
  isComplete,
  handleClose,
  totalStep,
  components,
  style = {},
  sxProgressBar = {},
}) => {
  const classes = useStyles();
  const { chainId } = useWeb3();
  const dom = document.getElementById('tx-modal-overlay');

  return (
    <>
      {ReactDOM.createPortal(
        <ProgressModal
          style={style}
          open={open}
          steps={steps}
          error={error}
          sxProgessBar={sxProgressBar}
          errorComponent={errorComponent}
          activeStep={activeStep}
          isAbleToClose={error || isComplete()}
          onClose={handleClose}
          components={{
            [totalStep]: (
              <Grid
                container
                direction="column"
                justifyContent="center"
                alignItems="center"
              >
                <Typography sx={{ mt: 2, mb: 1 }} variant="h3">
                  Request Complete
                </Typography>
                <Typography
                  sx={{ mt: 2, mb: 1 }}
                  variant="body2"
                  style={{
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    display: 'inherit',
                  }}
                >
                  Transaction hash :{' '}
                  <a
                    className={classes.txTag}
                    href={getExplorerTransactionLink(txhash, chainId)}
                    target="_blank"
                  >
                    {shortenIfTransactionHash(txhash)}
                  </a>
                </Typography>
              </Grid>
            ),
            ...components,
          }}
        />,
        dom
      )}
    </>
  );
};

export default TransactionModal;

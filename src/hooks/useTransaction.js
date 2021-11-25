import {useReducer, useState} from 'react';
import {Typography} from '@mui/material';

const initialState = {
  open: false,
  txhash: '',
  activeStep: 0,
  error: false,
  errorComponent: null,
};
export const reducer = (state, action) => {
  switch (action.type) {
    case 'OPEN':
      return {...state, open: true};
    case 'HASH':
      return {...state, txhash: action.tx};
    case 'NEXT_STEP':
      return {...state, activeStep: state.activeStep + 1};
    case 'ERROR':
      return {
        ...state,
        error: true,
        errorComponent: (
          <Typography
            sx={{mt: 2, mb: 1}}
            textAlign="center"
            sx={{color: 'red', fontWeight: 'bold'}}
          >
            {action.message}
          </Typography>
        ),
      };
    case 'CLOSE':
      return initialState;
    default:
      return initialState;
  }
};

const useTransaction = (steps, isComplete = null) => {
  const [txState, dispatch] = useReducer(reducer, initialState);
  const handleClose = () => dispatch({type: 'CLOSE'});
  const handleOpen = txhash => dispatch({type: 'OPEN'});
  const handleTx = tx => dispatch({type: 'HASH', tx: tx});
  const handleNextStep = () => dispatch({type: 'NEXT_STEP'});
  // const isComplete = () => txState.activeStep === steps.length;
  const handleError = error =>
    dispatch({type: 'ERROR', message: error.message});

  const signAndSendTransaction = fn => {
    handleNextStep();

    return fn()
      .on('receipt', receipt => {
        handleNextStep();
        handleTx(receipt.transactionHash);
        handleNextStep();
      })
      .on('error', (error, receipt) => {
        handleError(error);
      });
  };

  return {
    txState,
    steps,
    totalStep: steps.length,
    handleClose,
    handleOpen,
    handleTx,
    handleNextStep,
    handleError,
    isComplete: isComplete
      ? () => isComplete(txState)
      : () => txState.activeStep === steps.length,
    signAndSendTransaction,
  };
};

export default useTransaction;

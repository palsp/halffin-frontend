import React, { useReducer, useState } from "react";

const initialState = {
  open: false,
  txhash: "",
  step: 0,
  error: false,
  errorMessage: "",
};
export const reducer = (state, action) => {
  switch (action.type) {
    case "OPEN":
      return { ...state, open: true };
    case "HASH":
      return { ...state, txhash: action.tx };
    case "NEXT_STEP":
      return { ...state, step: action.step };
    case "ERROR":
      return { ...state, error: true, errorMessage: action.message };
    case "CLOSE":
      return initialState;
    default:
      return initialState;
  }
};

const TxContext = React.createContext({
  txState: initialState,
  steps: ["Sign transaction", "Transaction initiated", "Confirmation"],
  description: [
    "Sign transaction",
    "Creating a product to your account, please wait a moment.",
    "",
  ],
  handleClose: () => {
    return;
  },
  handleOpen: () => {
    return;
  },
  handleTx: (tx) => {
    return;
  },
  isComplete: () => {
    return;
  },
  handleError: () => {
    return;
  },
  handleNextStep: (nextStep) => {
    return;
  },
  signAndSendTransaction: () => {
    return;
  },
});

const TxProvider = ({ children }) => {
  const [txState, dispatch] = useReducer(reducer, initialState);
  const [steps] = useState([
    "Sign transaction",
    "Transaction initiated",
    "Confirmation",
  ]);

  const [description] = useState([
    "Sign transaction",
    "Creating a product to your account, please wait a moment.",
    "",
  ]);

  const handleClose = () => dispatch({ type: "CLOSE" });
  const handleOpen = (txhash) => dispatch({ type: "OPEN" });
  const handleTx = (tx) => dispatch({ type: "HASH", tx: tx });
  const handleNextStep = (nextStep) =>
    dispatch({ type: "NEXT_STEP", step: nextStep });
  const isComplete = () => txState.step === steps.length;
  const handleError = (error) =>
    dispatch({ type: "ERROR", message: error.message });

  const signAndSendTransaction = (fn) => {
    handleOpen();
    handleNextStep(1);
    return fn()
      .on("receipt", (receipt) => {
        handleNextStep(2);
        handleTx(receipt.transactionHash);
        handleNextStep(3);
      })
      .on("error", (error, receipt) => {
        handleError(error);
      });
  };

  return (
    <TxContext.Provider
      value={{
        txState,
        steps,
        description,
        handleClose,
        handleOpen,
        handleTx,
        handleNextStep,
        handleError,
        isComplete,
        signAndSendTransaction,
      }}
    >
      {children}
    </TxContext.Provider>
  );
};

export { TxContext, TxProvider };

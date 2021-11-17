import React, { useReducer, useState } from "react";

const initialState = {
  open: false,
  txhash: "",
  step: 0,
};
export const reducer = (state, action) => {
  switch (action.type) {
    case "OPEN":
      return { ...state, open: true };
    case "HASH":
      return { ...state, txhash: action.tx };
    case "NEXT_STEP":
      return { ...state, step: action.step };
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
  handleNextStep: (nextStep) => {
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
        isComplete,
      }}
    >
      {children}
    </TxContext.Provider>
  );
};

export { TxContext, TxProvider };

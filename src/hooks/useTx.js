import { useContext } from "react";
import { TxContext } from "context";

const useTx = () => useContext(TxContext);

export default useTx;

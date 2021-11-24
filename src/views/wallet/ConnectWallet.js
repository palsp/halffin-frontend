import { useMoralis } from "react-moralis";
import Button from "ui-component/extended/Button";

const ConnectWallet = ({ sx = {} }) => {
  const { enableWeb3, authenticate } = useMoralis();

  const enableAndAuthenticate = async () => {
    await enableWeb3();
    await authenticate();
  };

  return (
    <Button
      sx={sx}
      onClick={enableAndAuthenticate}
      label={<h4>Connect & Login</h4>}
    />
  );
};

export default ConnectWallet;

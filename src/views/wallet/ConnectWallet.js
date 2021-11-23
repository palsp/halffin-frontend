import {Chip} from '@mui/material';
import {useTheme} from '@mui/material/styles';
import {useMoralis} from 'react-moralis';

const chipSX = theme => ({
  height: '48px',
  alignItems: 'center',
  borderRadius: '10px',
  transition: 'all .2s ease-in-out',
  borderColor: theme.palette.primary.light,
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.text.base,
  '&[aria-controls="menu-list-grow"], &:hover': {
    background: `${theme.palette.primary.light}!important`,
    '& svg': {
      stroke: theme.palette.primary.light,
    },
  },
  '& .MuiChip-label': {
    lineHeight: 0,
  },
});

const ConnectWallet = ({sx}) => {
  const theme = useTheme();
  const {enableWeb3, authenticate} = useMoralis();

  const enableAndAuthenticate = async () => {
    await enableWeb3();
    await authenticate();
  };

  return (
    <Chip
      sx={{...chipSX(theme), ...sx}}
      onClick={enableAndAuthenticate}
      label={<h4>Connect & Login</h4>}
    />
  );
};

export default ConnectWallet;

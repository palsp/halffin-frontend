import PropTypes from 'prop-types';

// material-ui
import {useTheme} from '@mui/material/styles';
import {Box} from '@mui/material';

// project imports
import LogoSection from '../LogoSection';
import ProfileSection from './ProfileSection';
import NotificationSection from './NotificationSection';

// ==============================|| MAIN NAVBAR / HEADER ||============================== //

const Header = () => {
  const theme = useTheme();

  return (
    <>
      {/* logo & toggler button */}
      <Box
        sx={{
          width: 228,
          display: 'flex',
          [theme.breakpoints.down('md')]: {
            width: 'auto',
          },
        }}
      >
        <Box
          component="span"
          sx={{display: {xs: 'none', md: 'block'}, flexGrow: 1}}
        >
          <LogoSection />
        </Box>
      </Box>

      {/* header search */}
      <Box sx={{flexGrow: 1}} />
      <Box sx={{flexGrow: 1}} />

      {/* notification & profile */}
      <NotificationSection />
      <ProfileSection />
    </>
  );
};

export default Header;

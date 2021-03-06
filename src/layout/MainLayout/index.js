import { Outlet, useLocation } from 'react-router-dom';

// material-ui
import { styled, useTheme } from '@mui/material/styles';
import { AppBar, Box, CssBaseline, Toolbar } from '@mui/material';

// project imports
import Breadcrumbs from 'ui-component/extended/Breadcrumbs';
import Header from './Header';

// assets
import { IconChevronRight } from '@tabler/icons';
import BackButton from 'ui-component/BackButton';

// styles
const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme }) => ({
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    ...theme.typography.mainContent,
    position: 'relative',
    marginLeft: 0,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    width: '100%',
    [theme.breakpoints.down('md')]: {
      marginLeft: '20px',
    },
    [theme.breakpoints.down('sm')]: {
      marginLeft: '10px',
    },
  })
);

// ==============================|| MAIN LAYOUT ||============================== //

const MainLayout = () => {
  const theme = useTheme();
  const { pathname } = useLocation();
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      {/* header */}
      <AppBar
        enableColorOnDark
        position="fixed"
        color="inherit"
        elevation={0}
        sx={{
          background: 'transparent',
          // borderBottom: `1px solid ${theme.palette.background.default}`,
        }}
      >
        <Toolbar>
          <Header />
        </Toolbar>
      </AppBar>

      {/* main content */}
      <Main theme={theme}>
        {/* breadcrumb */}

        <Breadcrumbs separator={IconChevronRight} icon title rightAlign />
        {pathname !== '/' && <BackButton />}
        <Outlet />
      </Main>
    </Box>
  );
};

export default MainLayout;

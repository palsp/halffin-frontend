import {useState, useRef, useEffect} from 'react';
import {shortenIfAddress} from '@usedapp/core';
import {useNavigate} from 'react-router-dom';
import {useMoralis} from 'react-moralis';
import ConnectWallet from '../../../../views/wallet/ConnectWallet';
import config from 'config';

// material-ui
import {useTheme} from '@mui/material/styles';
import {
  Box,
  Chip,
  ClickAwayListener,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Popper,
  Typography,
} from '@mui/material';

// third-party
import PerfectScrollbar from 'react-perfect-scrollbar';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import Transitions from 'ui-component/extended/Transitions';

// assets
import {
  IconUser,
  IconBuildingStore,
  IconLogout,
  IconCirclePlus,
} from '@tabler/icons';

// ==============================|| PROFILE MENU ||============================== //

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

const ProfileSection = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [open, setOpen] = useState(false);
  const {
    enableWeb3,
    authenticate,
    isWeb3Enabled,
    isAuthenticated,
    logout,
    user,
  } = useMoralis();

  const enableAndAuthenticate = async () => {
    await enableWeb3();
    await authenticate();
  };
  /**
   * anchorRef is used on different componets and specifying one type leads to other components throwing an error
   * */
  const anchorRef = useRef(null);
  const handleLogout = () => {
    logout();
  };

  const handleClose = event => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  const handleListItemClick = (event, index, route = '') => {
    if (!isWeb3Enabled || !isAuthenticated) {
      enableAndAuthenticate();
    } else {
      setSelectedIndex(index);
      handleClose(event);

      if (route && route !== '') {
        navigate(route);
      }
    }
  };
  const handleToggle = () => {
    setOpen(prevOpen => !prevOpen);
  };

  const prevOpen = useRef(open);
  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }

    if (isAuthenticated) {
      enableWeb3();
    }
    prevOpen.current = open;
  }, [open, isAuthenticated]);

  return (
    <>
      {!isAuthenticated || !isWeb3Enabled ? (
        <ConnectWallet />
      ) : (
        <>
          <Chip
            sx={chipSX(theme)}
            label={
              <h4>
                {user ? shortenIfAddress(user.attributes.ethAddress) : ''}
              </h4>
            }
            variant="outlined"
            ref={anchorRef}
            aria-controls={open ? 'menu-list-grow' : undefined}
            aria-haspopup="true"
            onClick={handleToggle}
          />
          <Popper
            placement="bottom-end"
            open={open}
            anchorEl={anchorRef.current}
            role={undefined}
            transition
            disablePortal
            popperOptions={{
              modifiers: [
                {
                  name: 'offset',
                  options: {
                    offset: [0, 14],
                  },
                },
              ],
            }}
          >
            {({TransitionProps}) => (
              <Transitions in={open} {...TransitionProps}>
                <Paper>
                  <ClickAwayListener onClickAway={handleClose}>
                    <MainCard
                      border={false}
                      elevation={16}
                      content={false}
                      boxShadow
                      shadow={theme.shadows[16]}
                      style={{padding: '0px'}}
                    >
                      <PerfectScrollbar
                        style={{
                          height: '100%',
                          maxHeight: 'calc(100vh - 250px)',
                          overflowX: 'hidden',
                        }}
                      >
                        <Box sx={{p: 2}}>
                          <List
                            component="nav"
                            sx={{
                              width: '100%',
                              maxWidth: 350,
                              minWidth: 300,
                              backgroundColor: theme.palette.background.paper,
                              borderRadius: '10px',
                              [theme.breakpoints.down('md')]: {
                                minWidth: '100%',
                              },
                              '& .MuiListItemButton-root': {
                                mt: 0.5,
                              },
                            }}
                          >
                            <ListItemButton
                              sx={{
                                borderRadius: `${config.borderRadius}px`,
                              }}
                              selected={selectedIndex === 0}
                              onClick={event =>
                                handleListItemClick(
                                  event,
                                  0,
                                  '/user/account-profile'
                                )
                              }
                            >
                              <ListItemIcon>
                                <IconUser stroke={1.5} size="1.3rem" />
                              </ListItemIcon>
                              <ListItemText
                                primary={
                                  <Typography variant="body2">
                                    Profile
                                  </Typography>
                                }
                              />
                            </ListItemButton>
                            <ListItemButton
                              sx={{
                                borderRadius: `${config.borderRadius}px`,
                              }}
                              selected={selectedIndex === 2}
                              onClick={event =>
                                handleListItemClick(event, 0, '/')
                              }
                            >
                              <ListItemIcon>
                                <IconBuildingStore stroke={1.5} size="1.3rem" />
                              </ListItemIcon>
                              <ListItemText
                                primary={
                                  <Typography variant="body2">
                                    Market Place
                                  </Typography>
                                }
                              />
                            </ListItemButton>
                            <ListItemButton
                              sx={{
                                borderRadius: `${config.borderRadius}px`,
                              }}
                              selected={selectedIndex === 2}
                              onClick={event =>
                                handleListItemClick(
                                  event,
                                  0,
                                  '/my-product/create'
                                )
                              }
                            >
                              <ListItemIcon>
                                <IconCirclePlus stroke={1.5} size="1.3rem" />
                              </ListItemIcon>
                              <ListItemText
                                primary={
                                  <Typography variant="body2">
                                    Create Product
                                  </Typography>
                                }
                              />
                            </ListItemButton>
                            <ListItemButton
                              sx={{
                                borderRadius: `${config.borderRadius}px`,
                              }}
                              selected={selectedIndex === 3}
                              onClick={handleLogout}
                            >
                              <ListItemIcon>
                                <IconLogout stroke={1.5} size="1.3rem" />
                              </ListItemIcon>
                              <ListItemText
                                primary={
                                  <Typography variant="body2">
                                    Logout
                                  </Typography>
                                }
                              />
                            </ListItemButton>
                          </List>
                        </Box>
                      </PerfectScrollbar>
                    </MainCard>
                  </ClickAwayListener>
                </Paper>
              </Transitions>
            )}
          </Popper>
        </>
      )}
    </>
  );
};

export default ProfileSection;

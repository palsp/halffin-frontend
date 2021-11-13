import { useState, useRef, useEffect } from "react";
import { shortenIfAddress } from "@usedapp/core";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useMoralis } from "react-moralis";

// material-ui
import { useTheme } from "@mui/material/styles";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  ClickAwayListener,
  Divider,
  Grid,
  InputAdornment,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  OutlinedInput,
  Paper,
  Popper,
  Stack,
  Switch,
  Typography,
} from "@mui/material";

// third-party
import PerfectScrollbar from "react-perfect-scrollbar";

// project imports
import MainCard from "ui-component/cards/MainCard";
import Transitions from "ui-component/extended/Transitions";
import UpgradePlanCard from "./UpgradePlanCard";
import User1 from "assets/images/users/user-round.svg";

// assets
import {
  IconSettings,
  IconUser,
  IconBasket,
  IconBuildingStore,
  IconLogout,
  IconH4,
} from "@tabler/icons";

// ==============================|| PROFILE MENU ||============================== //

const ProfileSection = () => {
  const theme = useTheme();
  const customization = useSelector((state) => state.customization);
  const navigate = useNavigate();

  const [sdm, setSdm] = useState(true);
  const [value, setValue] = useState("");
  const [notification, setNotification] = useState(false);
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

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  const handleListItemClick = (event, index, route = "") => {
    if (!isWeb3Enabled || !isAuthenticated) {
      enableAndAuthenticate();
    } else {
      setSelectedIndex(index);
      handleClose(event);

      if (route && route !== "") {
        navigate(route);
      }
    }
  };
  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
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

  // console.log('web3 isAuthenticated: ', isWeb3Enabled, isAuthenticated);
  return (
    <>
      {!isAuthenticated || !isWeb3Enabled ? (
        <Chip
          onClick={enableAndAuthenticate}
          label={<h4>Connect & Login</h4>}
        />
      ) : (
        <>
          <Chip
            sx={{
              height: "48px",
              alignItems: "center",
              borderRadius: "27px",
              transition: "all .2s ease-in-out",
              borderColor: theme.palette.primary.light,
              backgroundColor: theme.palette.primary.light,
              '&[aria-controls="menu-list-grow"], &:hover': {
                borderColor: theme.palette.primary.main,
                background: `${theme.palette.primary.main}!important`,
                color: theme.palette.primary.light,
                "& svg": {
                  stroke: theme.palette.primary.light,
                },
              },
              "& .MuiChip-label": {
                lineHeight: 0,
              },
            }}
            label={
              <IconSettings
                stroke={1.5}
                size="1.5rem"
                color={theme.palette.primary.main}
              />
            }
            variant="outlined"
            ref={anchorRef}
            aria-controls={open ? "menu-list-grow" : undefined}
            aria-haspopup="true"
            onClick={handleToggle}
            color="primary"
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
                  name: "offset",
                  options: {
                    offset: [0, 14],
                  },
                },
              ],
            }}
          >
            {({ TransitionProps }) => (
              <Transitions in={open} {...TransitionProps}>
                <Paper>
                  <ClickAwayListener onClickAway={handleClose}>
                    <MainCard
                      border={false}
                      elevation={16}
                      content={false}
                      boxShadow
                      shadow={theme.shadows[16]}
                    >
                      <Box sx={{ p: 2 }}>
                        <Stack>
                          <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                          >
                            <Typography variant="h4">Hello, </Typography>
                            <Typography
                              component="span"
                              variant="h4"
                              sx={{ fontWeight: 400 }}
                            >
                              {user
                                ? shortenIfAddress(user.attributes.ethAddress)
                                : ""}
                            </Typography>
                          </Stack>
                        </Stack>
                        <Divider />
                      </Box>
                      <PerfectScrollbar
                        style={{
                          height: "100%",
                          maxHeight: "calc(100vh - 250px)",
                          overflowX: "hidden",
                        }}
                      >
                        <Box sx={{ p: 2 }}>
                          <List
                            component="nav"
                            sx={{
                              width: "100%",
                              maxWidth: 350,
                              minWidth: 300,
                              backgroundColor: theme.palette.background.paper,
                              borderRadius: "10px",
                              [theme.breakpoints.down("md")]: {
                                minWidth: "100%",
                              },
                              "& .MuiListItemButton-root": {
                                mt: 0.5,
                              },
                            }}
                          >
                            <ListItemButton
                              sx={{
                                borderRadius: `${customization.borderRadius}px`,
                              }}
                              selected={selectedIndex === 0}
                              onClick={(event) =>
                                handleListItemClick(
                                  event,
                                  0,
                                  "/user/account-profile"
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
                                borderRadius: `${customization.borderRadius}px`,
                              }}
                              selected={selectedIndex === 1}
                              onClick={(event) =>
                                handleListItemClick(
                                  event,
                                  1,
                                  "/user/social-profile/posts"
                                )
                              }
                            >
                              <ListItemIcon>
                                <IconBasket stroke={1.5} size="1.3rem" />
                              </ListItemIcon>
                              <ListItemText
                                primary={
                                  <Grid
                                    container
                                    spacing={1}
                                    justifyContent="space-between"
                                  >
                                    <Grid item>
                                      <Typography variant="body2">
                                        My purchases
                                      </Typography>
                                    </Grid>
                                    <Grid item>
                                      <Chip
                                        label="02"
                                        size="small"
                                        sx={{
                                          bgcolor: theme.palette.warning.dark,
                                          color:
                                            theme.palette.background.default,
                                        }}
                                      />
                                    </Grid>
                                  </Grid>
                                }
                              />
                            </ListItemButton>
                            <ListItemButton
                              sx={{
                                borderRadius: `${customization.borderRadius}px`,
                              }}
                              selected={selectedIndex === 2}
                              onClick={(event) =>
                                handleListItemClick(event, 0, "/my-product")
                              }
                            >
                              <ListItemIcon>
                                <IconBuildingStore stroke={1.5} size="1.3rem" />
                              </ListItemIcon>
                              <ListItemText
                                primary={
                                  <Typography variant="body2">
                                    My products
                                  </Typography>
                                }
                              />
                            </ListItemButton>
                            {user && isWeb3Enabled ? (
                              <ListItemButton
                                sx={{
                                  borderRadius: `${customization.borderRadius}px`,
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
                            ) : (
                              <></>
                            )}
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

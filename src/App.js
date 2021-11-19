import { useEffect } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, StyledEngineProvider } from '@mui/material';
import { useMoralis } from 'react-moralis';
// routing
import Routes from 'routes';

// defaultTheme
import themes from 'themes';

// project imports
import NavigationScroll from 'layout/NavigationScroll';
import config from 'config';

// ==============================|| APP ||============================== //

const App = () => {
  const { enableWeb3, isAuthenticated, Moralis } = useMoralis();

  useEffect(() => {
    Moralis.onAccountsChanged(async (accounts) => {
      await Moralis.link(accounts[0]);
    });
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      enableWeb3();
    }
  }, [isAuthenticated]);

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider
        theme={themes({
          fontFamily: config.fontFamily,
          borderRadius: config.borderRadius,
        })}
      >
        <CssBaseline />
        <NavigationScroll>
          <Routes />
        </NavigationScroll>
      </ThemeProvider>
    </StyledEngineProvider>
  );
};

export default App;

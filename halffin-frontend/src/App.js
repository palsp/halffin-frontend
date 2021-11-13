import { useSelector } from 'react-redux';
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

// ==============================|| APP ||============================== //

const App = () => {
    const customization = useSelector((state) => state.customization);
    const { enableWeb3, authenticate, isWeb3Enabled, isAuthenticated, user } = useMoralis();

    const enableAndAuthenticate = async () => {
        await enableWeb3();
        await authenticate();
    };

    useEffect(() => {
        if (isAuthenticated) {
            enableWeb3();
        }
    }, [isAuthenticated]);
    // console.log('web3 isAuthenticated: ', isWeb3Enabled, isAuthenticated, user);
    return (
        <StyledEngineProvider injectFirst>
            <ThemeProvider theme={themes(customization)}>
                <CssBaseline />
                <NavigationScroll>
                    <Routes />
                </NavigationScroll>
            </ThemeProvider>
        </StyledEngineProvider>
    );
};

export default App;

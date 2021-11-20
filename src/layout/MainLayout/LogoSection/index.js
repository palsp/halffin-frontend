import { Link } from 'react-router-dom';

// material-ui
import { ButtonBase } from '@mui/material';

// project imports
import config from 'config';
import Logo from 'ui-component/Logo';
import halffinlogo from 'assets/images/icons/halffinlogo.svg';
import halffinName from 'assets/images/icons/halffin-name.svg';
// ==============================|| MAIN LOGO ||============================== //

const LogoSection = () => (
    <ButtonBase disableRipple component={Link} to={config.defaultPath}>
        <img src={halffinlogo} height={80} />
        <img src={halffinName} height={80} />
    </ButtonBase>
);

export default LogoSection;

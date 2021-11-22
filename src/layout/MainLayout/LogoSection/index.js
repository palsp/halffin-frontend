import { Link } from 'react-router-dom';

// material-ui
import { ButtonBase } from '@mui/material';

// project imports
import config from 'config';
import halffinlogo from 'assets/images/icons/halffinlogo.svg';
import halffinName from 'assets/images/icons/halffintext.svg';
// ==============================|| MAIN LOGO ||============================== //

const LogoSection = () => (
    <ButtonBase disableRipple component={Link} to={config.defaultPath}>
        <img src={halffinlogo} height={70} />
        <img src={halffinName} height={25}/>
    </ButtonBase>
);

export default LogoSection;

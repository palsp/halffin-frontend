import { useNavigate } from 'react-router-dom';
import Button from 'ui-component/extended/Button';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const BackButton = ({ state }) => {
  const navigate = useNavigate();

  return (
    <Button
      sx={{
        position: 'absolute',
        top: 0,
        left: '3%',
        background: 'none',
      }}
      onClick={() => navigate(-1)}
      label={<ArrowBackIcon />}
    />
  );
};

export default BackButton;

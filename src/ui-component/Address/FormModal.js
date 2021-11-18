import { Box, Button, Modal } from '@mui/material';
import AddressForm from './AddressForm';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '60vw',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};

const FormModal = ({ open, handleOpen, handleClose, address, addAddress }) => {
  return (
    <>
      <Button onClick={handleOpen}>Edit Address</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box sx={{ ...style }}>
          <>
            <AddressForm address={address} addAddress={addAddress} />
          </>
          <Button onClick={handleClose}>Close Child Modal</Button>
        </Box>
      </Modal>
    </>
  );
};

export default FormModal;

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

const closeButtonStyle = {
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'flex-end',
};

const FormModal = ({ open, handleOpen, handleClose, address, modifyAddress, addressId = '' }) => {
  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'left', alignItems: 'left' }}>
        <Button onClick={handleOpen}>Edit Address</Button>
      </div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box sx={{ ...style }}>
          <div style={{ ...closeButtonStyle }}>
            <Button onClick={handleClose}>Cancel</Button>
          </div>
          <>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alighItems: 'center',
                marginBottom: '5px',
              }}
            >
              <h1>Shipping Address</h1>
              <h2>ID: {addressId}</h2>
              <h2>{address.firstName}</h2>
            </div>

            <AddressForm
              handleClose={handleClose}
              address={address}
              addressId={addressId}
              modifyAddress={modifyAddress}
            />
          </>
        </Box>
      </Modal>
    </>
  );
};

export default FormModal;

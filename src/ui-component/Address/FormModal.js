import { Box, Modal } from '@mui/material';
import Button from 'ui-component/extended/Button';
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

const FormModal = ({
  index = null,
  open,
  handleOpen,
  handleClose,
  address,
  modifyAddress,
  addressId = '',
}) => {
  return (
    <>
      <div
        style={{
          display: 'flex',
          justifyContent: `${index ? 'space-between' : 'right'}`,
          alignItems: 'left',
        }}
      >
        {index && (
          <Button
            style={{
              height: '2.4vh',
              borderRadius: '20px',
            }}
            variant="contained"
            label={<h4>{index}</h4>}
          />
        )}
        <Button
          style={{
            height: '2.4vh',
            borderRadius: '5px',
          }}
          variant="contained"
          onClick={handleOpen}
          label={<h4>Edit Address</h4>}
        />
      </div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box
          sx={{
            ...style,
            color: 'white',
            background: 'linear-gradient(136deg, #1e2f97 0%, #797ef6 50%, #1aa7ec 100%)',
          }}
        >
          <div style={{ ...closeButtonStyle }}>
            <Button
              style={{ height: '3vh', color: '#03045e', backgroundColor: 'transparent' }}
              variant="contained"
              onClick={handleClose}
              label={<h4>Cancel</h4>}
            />
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
              <h1 style={{ marginBottom: '50px' }}>Shipping Address</h1>
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

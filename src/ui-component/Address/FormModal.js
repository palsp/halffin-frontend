import {Box, Modal} from '@mui/material';
import Button from 'ui-component/extended/Button';
import AddressForm from './AddressForm';
import {Typography} from '@mui/material';
import Button from 'ui-component/extended/Button';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
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
  deleteOpen,
  handleOpen,
  handleClose,
  handleDeleteOpen,
  handleDeleteClose,
  address,
  modifyAddress,
  deleteAddress,
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
        <div>
          <Button
            style={{
              height: '2.4vh',
              borderRadius: '5px',
            }}
            variant="contained"
            onClick={handleOpen}
            label={<h4>Edit Address</h4>}
          />
          <Button
            style={{
              marginLeft: '5px',
              height: '2.4vh',
              borderRadius: '5px',
              backgroundColor: 'rgb(180,0,0)',
            }}
            variant="contained"
            onClick={handleDeleteOpen}
            label={<h4>Delete</h4>}
          />
        </div>
      </div>

      <Modal
        open={deleteOpen}
        onClose={handleDeleteClose}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box
          sx={{
            ...style,
            color: 'white',
            background:
              'linear-gradient(136deg, #1e2f97 0%, #797ef6 50%, #1aa7ec 100%)',
          }}
        >
          <>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                flexDirection: 'column',
                alighItems: 'center',
                marginBottom: '5px',
              }}
            >
              <h1 style={{marginBottom: '50px'}}>
                Do you sure you want to delete this address ?
              </h1>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  flexDirection: 'row',
                }}
              >
                <Button
                  style={{width: '30%', height: '4vh', marginRight: '20px'}}
                  variant="contained"
                  onClick={handleDeleteClose}
                  label={<h4>Cancel</h4>}
                />

                <Button
                  style={{width: '30%', height: '4vh', backgroundColor: 'red'}}
                  variant="contained"
                  onClick={async () => {
                    await deleteAddress(addressId);
                    handleDeleteClose();
                  }}
                  label={<h4>Delete</h4>}
                />
              </div>
            </div>
          </>
        </Box>
      </Modal>
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
            background:
              'linear-gradient(136deg, #1e2f97 0%, #797ef6 50%, #1aa7ec 100%)',
          }}
        >
          <div style={{...closeButtonStyle}}>
            <Button
              style={{
                height: '3vh',
                color: '#03045e',
                backgroundColor: 'transparent',
              }}
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
                marginBottom: '20px',
              }}
            >
              <Typography variant="h1">Shipping Address</Typography>
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

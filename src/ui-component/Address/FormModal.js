import {Box, Modal, useTheme} from '@mui/material';
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

const FormModal = ({open, handleOpen, handleClose, address, addAddress}) => {
  const theme = useTheme();
  return (
    <>
      <div
        style={{display: 'flex', justifyContent: 'left', alignItems: 'left'}}
      >
        <Button
          onClick={handleOpen}
          label={<Typography>Edit Address</Typography>}
          icon={<EditIcon fontSize="small" />}
          sx={{
            backgroundColor: 'transparent',
            margin: '14px',
            color: theme.palette.text.card,
            '.MuiChip-icon': {
              color: theme.palette.text.card,
            },
            '&:hover': {
              background: 'rgba(3, 4, 94, 0.04)!important',
              color: `${theme.palette.primary.main}!important`,
              '& svg': {
                color: theme.palette.primary.main,
                stroke: theme.palette.primary.main,
              },
            },
          }}
        />
      </div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box sx={{...style}}>
          <div style={{...closeButtonStyle}}>
            <Button
              onClick={handleClose}
              icon={<CloseIcon color="black" />}
              sx={{
                backgroundColor: 'transparent',
                '& svg': {
                  color: `${theme.palette.primary.main}!important`,
                  stroke: theme.palette.primary.main,
                },
                '&:hover': {
                  backgroundColor: 'transparent!important',
                  color: `${theme.palette.primary.main}!important`,
                },
              }}
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
              addAddress={addAddress}
            />
          </>
        </Box>
      </Modal>
    </>
  );
};

export default FormModal;

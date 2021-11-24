import styles from './AddressForm.module.css';
import {Formik, Field, Form, ErrorMessage} from 'formik';
import * as Yup from 'yup';
import {Typography, TextField, useTheme} from '@mui/material';

const AddressForm = ({address, addAddress, handleClose}) => {
  const theme = useTheme();
  return (
    <Formik
      initialValues={address}
      validationSchema={Yup.object({
        firstName: Yup.string()
          .max(15, 'Must be 15 characters or less')
          .required('Required'),
        lastName: Yup.string()
          .max(20, 'Must be 20 characters or less')
          .required('Required'),
        email: Yup.string().email('Invalid email address').required('Required'),
        address1: Yup.string().required('Required'),
        address2: Yup.string(),
        city: Yup.string().required('Required'),
        state: Yup.string().required('Required'),
        postalCode: Yup.string().required('Required'),
        countryCode: Yup.string().required('Required'),
        phoneNumber: Yup.string().required('Required'),
      })}
      onSubmit={(values, {setSubmitting}) => {
        console.log('values', values);

        addAddress(values).then(() => {
          setSubmitting(false);
          handleClose();
        });
      }}
    >
      {props => (
        <Form className={styles.form}>
          <div className={styles.grid}>
            <div className={styles.left}>
              <TextField
                fullWidth
                required
                name="firstName"
                label="First Name"
                margin="normal"
                type="text"
                sx={{...theme.typography.customInput}}
                value={props.values.firstName}
                onChange={props.handleChange}
                error={
                  props.touched.firstName && Boolean(props.errors.firstName)
                }
                helperText={props.touched.firstName && props.errors.firstName}
              />

              <TextField
                fullWidth
                required
                name="email"
                label="Email Address"
                margin="normal"
                type="text"
                sx={{...theme.typography.customInput}}
                value={props.values.email}
                onChange={props.handleChange}
                error={props.touched.email && Boolean(props.errors.email)}
                helperText={props.touched.email && props.errors.email}
              />

              <TextField
                fullWidth
                required
                name="address1"
                label="address1"
                margin="normal"
                type="text"
                sx={{...theme.typography.customInput}}
                value={props.values.address1}
                onChange={props.handleChange}
                error={props.touched.address1 && Boolean(props.errors.address1)}
                helperText={props.touched.address1 && props.errors.address1}
              />

              <TextField
                fullWidth
                required
                name="address2"
                label="address2"
                margin="normal"
                type="text"
                sx={{...theme.typography.customInput}}
                value={props.values.address2}
                onChange={props.handleChange}
                error={props.touched.address2 && Boolean(props.errors.address2)}
                helperText={props.touched.address2 && props.errors.address2}
              />

              <TextField
                fullWidth
                required
                name="countryCode"
                label="Country Code"
                margin="normal"
                type="text"
                sx={{...theme.typography.customInput}}
                value={props.values.countryCode}
                onChange={props.handleChange}
                error={
                  props.touched.countryCode && Boolean(props.errors.countryCode)
                }
                helperText={
                  props.touched.countryCode && props.errors.countryCode
                }
              />
            </div>
            <div className={styles.right}>
              <TextField
                fullWidth
                required
                name="lastName"
                label="Last Name"
                margin="normal"
                type="text"
                sx={{...theme.typography.customInput}}
                value={props.values.lastName}
                onChange={props.handleChange}
                error={props.touched.lastName && Boolean(props.errors.lastName)}
                helperText={props.touched.lastName && props.errors.lastName}
              />

              <TextField
                fullWidth
                required
                name="city"
                label="City"
                margin="normal"
                type="text"
                sx={{...theme.typography.customInput}}
                value={props.values.city}
                onChange={props.handleChange}
                error={props.touched.city && Boolean(props.errors.city)}
                helperText={props.touched.city && props.errors.city}
              />

              <TextField
                fullWidth
                required
                name="state"
                label="State"
                margin="normal"
                type="text"
                sx={{...theme.typography.customInput}}
                value={props.values.state}
                onChange={props.handleChange}
                error={props.touched.state && Boolean(props.errors.state)}
                helperText={props.touched.state && props.errors.state}
              />

              <TextField
                fullWidth
                required
                name="postalCode"
                label="Postal Code"
                margin="normal"
                type="text"
                sx={{...theme.typography.customInput}}
                value={props.values.postalCode}
                onChange={props.handleChange}
                error={
                  props.touched.postalCode && Boolean(props.errors.postalCode)
                }
                helperText={props.touched.postalCode && props.errors.postalCode}
              />

              <TextField
                fullWidth
                required
                name="phoneNumber"
                label="Phone Number"
                margin="normal"
                type="text"
                sx={{...theme.typography.customInput}}
                value={props.values.phoneNumber}
                onChange={props.handleChange}
                error={
                  props.touched.phoneNumber && Boolean(props.errors.phoneNumber)
                }
                helperText={
                  props.touched.phoneNumber && props.errors.phoneNumber
                }
              />
            </div>
          </div>

          <div className={styles.centered}>
            <button className={styles.button} type="submit">
              Submit
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default AddressForm;

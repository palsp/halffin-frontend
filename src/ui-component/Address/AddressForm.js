import styles from './AddressForm.module.css';
import { Formik, Form, useFormik } from 'formik';
import * as yup from 'yup';
import { Typography, TextField, useTheme } from '@mui/material';

const validationSchema = yup.object({
  firstName: yup
    .string()
    .max(15, 'Must be 15 characters or less')
    .required('Required'),
  lastName: yup
    .string()
    .max(20, 'Must be 20 characters or less')
    .required('Required'),
  email: yup.string().email('Invalid email address').required('Required'),
  address1: yup.string().required('Required'),
  address2: yup.string(),
  city: yup.string().required('Required'),
  state: yup.string().required('Required'),
  postalCode: yup.string().required('Required'),
  countryCode: yup.string().required('Required'),
  phoneNumber: yup.string().required('Required'),
});

const AddressForm = ({ address, addressId, modifyAddress, handleClose }) => {
  const theme = useTheme();
  const formik = useFormik({
    initialValues: address,
    validationSchema,
    onSubmit: (values, { setSubmitting }) => {
      if (addressId.length > 0) {
        modifyAddress(values, addressId).then(() => {
          setSubmitting(false);
          handleClose();
        });
      } else {
        modifyAddress(values).then(() => {
          setSubmitting(false);
          handleClose();
        });
      }
    },
  });
  return (
    <form className={styles.form} noValidate onSubmit={formik.handleSubmit}>
      <div className={styles.grid}>
        <div className={styles.left}>
          <TextField
            fullWidth
            required
            name="firstName"
            label="First Name"
            margin="normal"
            type="text"
            sx={{ ...theme.typography.customInput }}
            value={formik.values.firstName}
            onChange={formik.handleChange}
            error={formik.touched.firstName && Boolean(formik.errors.firstName)}
            helperText={formik.touched.firstName && formik.errors.firstName}
          />

          <TextField
            fullWidth
            required
            name="email"
            label="Email Address"
            margin="normal"
            type="text"
            sx={{ ...theme.typography.customInput }}
            value={formik.values.email}
            onChange={formik.handleChange}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
          />

          <TextField
            fullWidth
            required
            name="address1"
            label="address1"
            margin="normal"
            type="text"
            sx={{ ...theme.typography.customInput }}
            value={formik.values.address1}
            onChange={formik.handleChange}
            error={formik.touched.address1 && Boolean(formik.errors.address1)}
            helperText={formik.touched.address1 && formik.errors.address1}
          />

          <TextField
            fullWidth
            required
            name="address2"
            label="address2"
            margin="normal"
            type="text"
            sx={{ ...theme.typography.customInput }}
            value={formik.values.address2}
            onChange={formik.handleChange}
            error={formik.touched.address2 && Boolean(formik.errors.address2)}
            helperText={formik.touched.address2 && formik.errors.address2}
          />

          <TextField
            fullWidth
            required
            name="countryCode"
            label="Country Code"
            margin="normal"
            type="text"
            sx={{ ...theme.typography.customInput }}
            value={formik.values.countryCode}
            onChange={formik.handleChange}
            error={
              formik.touched.countryCode && Boolean(formik.errors.countryCode)
            }
            helperText={formik.touched.countryCode && formik.errors.countryCode}
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
            sx={{ ...theme.typography.customInput }}
            value={formik.values.lastName}
            onChange={formik.handleChange}
            error={formik.touched.lastName && Boolean(formik.errors.lastName)}
            helperText={formik.touched.lastName && formik.errors.lastName}
          />

          <TextField
            fullWidth
            required
            name="city"
            label="City"
            margin="normal"
            type="text"
            sx={{ ...theme.typography.customInput }}
            value={formik.values.city}
            onChange={formik.handleChange}
            error={formik.touched.city && Boolean(formik.errors.city)}
            helperText={formik.touched.city && formik.errors.city}
          />

          <TextField
            fullWidth
            required
            name="state"
            label="State"
            margin="normal"
            type="text"
            sx={{ ...theme.typography.customInput }}
            value={formik.values.state}
            onChange={formik.handleChange}
            error={formik.touched.state && Boolean(formik.errors.state)}
            helperText={formik.touched.state && formik.errors.state}
          />

          <TextField
            fullWidth
            required
            name="postalCode"
            label="Postal Code"
            margin="normal"
            type="text"
            sx={{ ...theme.typography.customInput }}
            value={formik.values.postalCode}
            onChange={formik.handleChange}
            error={
              formik.touched.postalCode && Boolean(formik.errors.postalCode)
            }
            helperText={formik.touched.postalCode && formik.errors.postalCode}
          />

          <TextField
            fullWidth
            required
            name="phoneNumber"
            label="Phone Number"
            margin="normal"
            type="text"
            sx={{ ...theme.typography.customInput }}
            value={formik.values.phoneNumber}
            onChange={formik.handleChange}
            error={
              formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber)
            }
            helperText={formik.touched.phoneNumber && formik.errors.phoneNumber}
          />
        </div>
      </div>

      <div className={styles.centered}>
        <button className={styles.button} type="submit">
          Submit
        </button>
      </div>
    </form>
  );
};

export default AddressForm;

import styles from './AddressForm.module.css';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const AddressForm = ({ address, addAddress }) => {
  return (
    <Formik
      initialValues={address}
      validationSchema={Yup.object({
        firstName: Yup.string().max(15, 'Must be 15 characters or less').required('Required'),
        lastName: Yup.string().max(20, 'Must be 20 characters or less').required('Required'),
        email: Yup.string().email('Invalid email address').required('Required'),
        address1: Yup.string().required('Required'),
        address2: Yup.string(),
        city: Yup.string().required('Required'),
        state: Yup.string().required('Required'),
        postalCode: Yup.string().required('Required'),
        countryCode: Yup.string().required('Required'),
        phoneNumber: Yup.string().required('Required'),
      })}
      onSubmit={(values, { setSubmitting }) => {
        console.log('values', values);

        addAddress(values).then(() => {
          setSubmitting(false);
        });
      }}
    >
      <Form className={styles.form}>
        <div className={styles.input}>
          <label htmlFor="firstName">First Name</label>
          <Field name="firstName" type="text" />
          <ErrorMessage
            name="firstName"
            render={(msg) => <div className={styles.errorMessage}>{msg}</div>}
          />
        </div>

        <label htmlFor="lastName">Last Name</label>
        <Field name="lastName" type="text" />
        <ErrorMessage
          name="lastName"
          render={(msg) => <div className={styles.errorMessage}>{msg}</div>}
        />

        <label htmlFor="email">Email Address</label>
        <Field name="email" type="email" />
        <ErrorMessage
          name="email"
          render={(msg) => <div className={styles.errorMessage}>{msg}</div>}
        />

        <label htmlFor="address1">Address Line 1</label>
        <Field name="address1" as="textarea" />
        <ErrorMessage
          name="address1"
          render={(msg) => <div className={styles.errorMessage}>{msg}</div>}
        />

        <label htmlFor="address2">Address Line 2</label>
        <Field name="address2" as="textarea" />
        <ErrorMessage
          name="address2"
          render={(msg) => <div className={styles.errorMessage}>{msg}</div>}
        />

        <label htmlFor="city">City</label>
        <Field name="city" type="text" />
        <ErrorMessage
          name="city"
          render={(msg) => <div className={styles.errorMessage}>{msg}</div>}
        />

        <label htmlFor="state">State</label>
        <Field name="state" type="state" />
        <ErrorMessage
          name="state"
          render={(msg) => <div className={styles.errorMessage}>{msg}</div>}
        />

        <label htmlFor="postalCode">Postal Code</label>
        <Field name="postalCode" type="text" />
        <ErrorMessage
          name="postalCode"
          render={(msg) => <div className={styles.errorMessage}>{msg}</div>}
        />

        <label htmlFor="countryCode">Country Code</label>
        <Field name="countryCode" type="text" />
        <ErrorMessage
          name="countryCode"
          render={(msg) => <div className={styles.errorMessage}>{msg}</div>}
        />

        <label htmlFor="phoneNumber">Phone number</label>
        <Field name="phoneNumber" type="text" />
        <ErrorMessage
          name="phoneNumber"
          render={(msg) => <div className={styles.errorMessage}>{msg}</div>}
        />

        <button type="submit">Submit</button>
      </Form>
    </Formik>
  );
};

export default AddressForm;

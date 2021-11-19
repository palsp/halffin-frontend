import styles from './AddressForm.module.css';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const AddressForm = ({ address, addAddress, handleClose }) => {
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
          handleClose();
        });
      }}
    >
      <Form className={styles.form}>
        <div className={styles.grid}>
          <div className={styles.left}>
            <label className={styles.label} htmlFor="firstName">
              First Name
            </label>
            <Field className={styles.field} name="firstName" type="text" />
            <ErrorMessage
              name="firstName"
              render={(msg) => <div className={styles.errorMessage}>{msg}</div>}
            />

            <label className={styles.label} htmlFor="email">
              Email Address
            </label>
            <Field className={styles.field} name="email" type="email" />
            <ErrorMessage
              name="email"
              render={(msg) => <div className={styles.errorMessage}>{msg}</div>}
            />

            <label className={styles.label} htmlFor="address1">
              Address Line 1
            </label>
            <Field className={styles.field} name="address1" as="textarea" />
            <ErrorMessage
              name="address1"
              render={(msg) => <div className={styles.errorMessage}>{msg}</div>}
            />

            <label className={styles.label} htmlFor="address2">
              Address Line 2
            </label>
            <Field className={styles.field} name="address2" as="textarea" />
            <ErrorMessage
              name="address2"
              render={(msg) => <div className={styles.errorMessage}>{msg}</div>}
            />

            <label className={styles.label} htmlFor="countryCode">
              Country Code
            </label>
            <Field className={styles.field} name="countryCode" type="text" />
            <ErrorMessage
              name="countryCode"
              render={(msg) => <div className={styles.errorMessage}>{msg}</div>}
            />
          </div>

          <div className={styles.right}>
            <label className={styles.label} htmlFor="lastName">
              Last Name
            </label>
            <Field className={styles.field} name="lastName" type="text" />
            <ErrorMessage
              name="lastName"
              render={(msg) => <div className={styles.errorMessage}>{msg}</div>}
            />

            <label className={styles.label} htmlFor="city">
              City
            </label>
            <Field className={styles.field} name="city" type="text" />
            <ErrorMessage
              name="city"
              render={(msg) => <div className={styles.errorMessage}>{msg}</div>}
            />

            <label className={styles.label} htmlFor="state">
              State
            </label>
            <Field className={styles.field} name="state" type="state" />
            <ErrorMessage
              name="state"
              render={(msg) => <div className={styles.errorMessage}>{msg}</div>}
            />

            <label className={styles.label} htmlFor="postalCode">
              Postal Code
            </label>
            <Field className={styles.field} name="postalCode" type="text" />
            <ErrorMessage
              name="postalCode"
              render={(msg) => <div className={styles.errorMessage}>{msg}</div>}
            />

            <label className={styles.label} htmlFor="phoneNumber">
              Phone number
            </label>
            <Field className={styles.field} name="phoneNumber" type="text" />
            <ErrorMessage
              name="phoneNumber"
              render={(msg) => <div className={styles.errorMessage}>{msg}</div>}
            />
          </div>
        </div>

        <div className={styles.centered}>
          <button className={styles.button} type="submit">
            Submit
          </button>
        </div>
      </Form>
    </Formik>
  );
};

export default AddressForm;

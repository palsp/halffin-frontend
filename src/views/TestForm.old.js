import styles from './TestForm.module.css';
import React from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';

// const InputForm = () => {
//   return (<></>)
// }

const TestForm = () => {
  return (
    <Formik
      initialValues={{
        firstName: '',
        lastName: '',
        email: '',
        address1: '',
        address2: '',
        city: '',
        state: '',
        postalCode: '',
        countryCode: '',
        phoneNumber: '',
      }}
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
        // setTimeout(() => {
        //   alert(JSON.stringify(values, null, 2));
        //   setSubmitting(false);
        // }, 400);

        console.log(values);
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

        <div className={styles.input}>
          <label htmlFor="lastName">Last Name</label>
          <Field name="lastName" type="text" />
          <ErrorMessage
            name="lastName"
            render={(msg) => <div className={styles.errorMessage}>{msg}</div>}
          />
        </div>

        <div className={styles.input}>
          <label htmlFor="email">Email Address</label>
          <Field name="email" type="email" />
          <ErrorMessage
            name="email"
            render={(msg) => <div className={styles.errorMessage}>{msg}</div>}
          />
        </div>

        <div className={styles.input}>
          <label htmlFor="address1">Address 1</label>
          <Field name="address1" as="textarea" />
          <ErrorMessage
            name="address1"
            render={(msg) => <div className={styles.errorMessage}>{msg}</div>}
          />
        </div>

        <div className={styles.input}>
          <label htmlFor="address2">Address 2</label>
          <Field name="address2" as="textarea" />
        </div>

        <div className={styles.input}>
          <label htmlFor="countryCode">Phone Country Code</label>
          <Field name="countryCode" type="text" placeholder="+66" />
          <ErrorMessage
            name="countryCode"
            render={(msg) => <div className={styles.errorMessage}>{msg}</div>}
          />
        </div>

        <div className={styles.input}>
          <label htmlFor="phoneNumber">Phone Number</label>
          <Field name="phoneNumber" type="text" placeholder="81-234-5678" />
          <ErrorMessage
            name="phoneNumber"
            render={(msg) => <div className={styles.errorMessage}>{msg}</div>}
          />
        </div>

        <button type="submit">Submit</button>
      </Form>
    </Formik>
  );
};

export default TestForm;

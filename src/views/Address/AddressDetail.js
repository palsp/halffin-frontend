import Detail from './Detail/Detail';
import { formatPhoneNumberIntl } from 'react-phone-number-input';

const AddressDetail = ({ address }) => {
  const {
    firstName,
    lastName,
    email,
    address1,
    address2,
    city,
    state,
    postalCode,
    countryCode,
    phoneNumber,
  } = address;

  return (
    <>
      {firstName.length > 0 ? (
        <div style={{ justifyContent: 'left', marginTop: '12px' }}>
          <Detail title={'Name:'} description={`${firstName} ${lastName}`} />
          <Detail title={'Email:'} description={`${email}`} />
          <Detail
            title={'Address: '}
            description={`${address1} ${address2}
      ${city} ${state}
      ${postalCode}`}
          />
          <Detail
            title={'Phone:'}
            description={`${formatPhoneNumberIntl(
              phoneNumber
            )} ${countryCode} `}
          />
        </div>
      ) : null}
    </>
  );
};

export default AddressDetail;

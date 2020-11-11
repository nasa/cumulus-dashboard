import PropTypes from 'prop-types';
import React, { lazy, Suspense } from 'react';
// import Datepicker from '../Datepicker/DatepickerRange';

const Datepicker = lazy(() => import('../Datepicker/DatepickerRange'));

const DatePickerHeader = ({ heading, onChange, showDatePicker = true }) => (
  <>
    {showDatePicker ? <div className='content__header'>
      <div className='row'>
        <ul className='datetimeheader'>
          <li>
            <div className='datetimeheader__content'>
              <h1 className='heading--xlarge'>{heading}</h1>
            </div>
          </li>
          <li>
            <Suspense fallback={<div>Loading...</div>}>
              <Datepicker hideWrapper={true} onChange={onChange} />
            </Suspense>
          </li>
        </ul>
      </div>
    </div>
      : <div className='content__header'>
        <div className='row'>
          <h1 className='heading--xlarge'>{heading}</h1>
        </div>
      </div>
    }
  </>
);

DatePickerHeader.propTypes = {
  heading: PropTypes.string,
  onChange: PropTypes.func,
  showDatePicker: PropTypes.bool
};

export default DatePickerHeader;

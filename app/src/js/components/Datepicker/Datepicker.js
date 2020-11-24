import React from 'react';
import PropTypes from 'prop-types';
import DateTimePicker from 'react-datetime-picker';

const ConditionalWrapper = ({ children, shouldWrap, wrapper }) => (
  <>{shouldWrap ? wrapper(children) : children}</>
);

ConditionalWrapper.propTypes = {
  children: PropTypes.node,
  shouldWrap: PropTypes.bool,
  wrapper: PropTypes.func,
};

const Datepicker = ({ format, id, label, locale, name, onChange, value, ...rest }) => {
  function handleOnChange(date) {
    if (typeof onChange === 'function') {
      onChange(id, date);
    }
  }

  return (
    <>
      <ConditionalWrapper
        shouldWrap={!!label}
        wrapper={(children) => (
          <div className="form__text">
            <label htmlFor={id}>{label}</label>
            {children}
          </div>
        )}
      >
        <DateTimePicker
          {...rest}
          amPmAriaLabel="Select AM/PM"
          calendarAriaLabel="Toggle calendar"
          clearAriaLabel="Clear value"
          dayAriaLabel="Day"
          dayPlaceholder="DD"
          disableClock={true}
          format={format}
          hourAriaLabel="Hour"
          hourPlaceholder="HH"
          locale={locale}
          minuteAriaLabel="Minute"
          minutePlaceholder="mm"
          monthAriaLabel="Month"
          monthPlaceholder="MM"
          name={name}
          nativeInputAriaLabel="Date"
          onChange={handleOnChange}
          secondAriaLabel="Second"
          secondPlaceholder="ss"
          value={value}
          yearAriaLabel="Year"
          yearPlaceholder="YYYY"
        />
      </ConditionalWrapper>
    </>
  );
};

Datepicker.propTypes = {
  format: PropTypes.string,
  id: PropTypes.string,
  label: PropTypes.node,
  locale: PropTypes.string,
  name: PropTypes.string,
  onChange: PropTypes.func,
  value: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.string]),
};

export default Datepicker;

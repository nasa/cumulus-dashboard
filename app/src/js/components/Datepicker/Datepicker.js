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
          dayPlaceholder="DD"
          disableClock={true}
          format={format}
          hourPlaceholder="HH"
          locale={locale}
          monthPlaceholder="MM"
          minutePlaceholder="mm"
          name={name}
          onChange={handleOnChange}
          value={value}
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

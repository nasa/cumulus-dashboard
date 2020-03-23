import Datepicker from '../Datepicker/Datepicker';
import PropTypes from 'prop-types';
import React from 'react';

class DatePickerHeader extends React.Component {
  render () {
    return (
      <Datepicker hideWrapper={true} onChange={this.props.onChange} />
    );
  }
}

DatePickerHeader.propTypes = {
  onChange: PropTypes.func
};

export default DatePickerHeader;

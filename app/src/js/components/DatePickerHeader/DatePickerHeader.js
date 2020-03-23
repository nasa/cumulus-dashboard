import { window } from '../../utils/browser';
import Datepicker from '../Datepicker/Datepicker';
import React from 'react';

class DatePickerHeader extends React.Component {
  handleChange () {
    window.location.reload();
  }

  render () {
    return (
      <Datepicker hideWrapper={true} onChange={() => this.handleChange()} />
    );
  }
}

export default DatePickerHeader;

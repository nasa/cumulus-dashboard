import { window } from '../../utils/browser';
import Datapicker from '../Datepicker/Datepicker';
import React from 'react';

class DatePickerHeader extends React.Component {
  handleChange () {
    window.location.reload();
  }

  render () {
    return (
      <Datapicker hideWrapper={true} onChange={() => this.handleChange()} />
    );
  }
}

export default DatePickerHeader;

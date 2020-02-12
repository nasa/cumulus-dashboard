import React from 'react';
import isNil from 'lodash.isnil';
import moment from 'moment';
import DateTimePicker from 'react-datetime-picker';
import PropTypes from 'prop-types';

export const defaultDateRange = '1 day';
const defaultHourFormat = '12HR';
const allDateRanges = [
  'All',
  '1 hour',
  '1 day',
  '1 week',
  '1 month',
  '50 days',
  '180 days',
  '1 year'
];
const allHourFormats = ['12HR', '24HR'];
const dateTimeFormat = 'YYYY-MM-DDTHH:mm:ss.sss';

/**
 * Get the date time range based on the user selection with the Datepicker.
 * The startDateTime and endDateTime can be null.
 *
 * @function getDateTimeRange
 * @param  {Object} selection - the date selection with the Datepicker
 * @returns {Object} the selected date time range { startDateTime: <Date>, endDateTime: <Date> }
 */
export const getDateTimeRange = function (selection) {
  const selectedRange = { startDateTime: null, endDateTime: null };
  const { dateRange, startDateTime, endDateTime } = selection;

  if (!isNil(startDateTime) && !isNil(endDateTime)) {
    selectedRange.startDateTime = moment.utc(startDateTime).toDate();
    selectedRange.endDateTime = moment.utc(endDateTime).toDate();
  } else if (dateRange !== 'All') {
    const rangeFields = dateRange.split(/\s+/);
    selectedRange.startDateTime = moment.utc().startOf('minute')
      .subtract(parseInt(rangeFields[0], 10), rangeFields[1]).toDate();
  }
  return selectedRange;
};

/**
 * Component representing the Datepicker.
 * Use by adding <Datepicker />. Use onChange prop for getting new values.
 * The returned value is an object with updates from user selections.
 * The startDateTime and endDateTime can have null value.
 *
 * onChangeFunction = (value) => this.setState(value);
 *
 * <Datepicker
 *   onChange={onChangeFunction}
 * />
 */
export class Datepicker extends React.PureComponent {
  constructor (props) {
    super(props);
    this.handleDateRangeChange = this.handleDateRangeChange.bind(this);
    this.handleHourFormatChange = this.handleHourFormatChange.bind(this);
    this.handleDateTimeRangeChange = this.handleDateTimeRangeChange.bind(this);
    this.clear = this.clear.bind(this);
  }

  clear () {
    this.onChange({...Datepicker.defaultProps});
  }

  handleDateRangeChange (e) {
    const dateRange = e.target.value;

    // set dateRange and clear the dateTimeRange selection
    this.onChange({...Datepicker.defaultProps, dateRange});
  }

  handleHourFormatChange (e) {
    this.onChange({[e.target.name]: e.target.value});
  }

  handleDateTimeRangeChange (name, newValue) {
    // The user input is in UTC time zone, but the DateTimePicker takes it as local time.
    // So we need convert the Date object to UTC time zone by ignoring the time zone offset.
    const utcValue = moment.utc(moment(newValue).format(dateTimeFormat)).format();
    const updatedProps = {
      startDateTime: this.props.startDateTime,
      endDateTime: this.props.endDateTime,
      [name]: utcValue
    };

    // only reset the date range if both start and end are selected
    const { startDateTime, endDateTime } = updatedProps;
    if (startDateTime && endDateTime) {
      updatedProps.dateRange = defaultDateRange;
    }
    this.onChange(updatedProps);
  }

  onChange (value) {
    this.props.onChange(value);
  }

  renderDateRangeDropDown () {
    return (
      <React.Fragment>
        <div className="datetime dropdown__dtrange">
          <select
            name='dateRange'
            value={this.props.dateRange}
            onChange={this.handleDateRangeChange}>
            {allDateRanges.map((option, i) => <option value={option} key={i}>{option}</option>)}
          </select>
        </div>
      </React.Fragment>
    );
  }

  renderHourFormatSelect () {
    const name = 'hourFormat';

    return (
      <React.Fragment>
        {allHourFormats.map((option, i) => {
          return (
            <label className="selector__hrformat" key={i}>
              <input
                type="radio"
                name={name}
                value={option}
                key={i}
                checked={option === this.props.hourFormat}
                onChange={this.handleHourFormatChange}
              />
              <span className="selector"></span>
              {option}
            </label>
          );
        })
        }
      </React.Fragment>
    );
  }

  renderDateTimeRange (name) {
    const hourFormat = this.props.hourFormat;
    const value = this.props[name];
    const locale = (hourFormat === '24HR') ? 'en-GB' : 'en-US';
    const format = (hourFormat === '24HR') ? 'MM/dd/yyyyy HH:mm' : 'MM/dd/yyyyy hh:mm a';

    // The input date value is in UTC time zone, but the DateTimePicker uses local time for
    // display.  We want to display the UTC value by ignoring the time zone offset.
    const utcValue = isNil(value) ? null : moment(moment.utc(value).format(dateTimeFormat)).toDate();

    return (
      <DateTimePicker
        dayPlaceholder='DD'
        format={format}
        hourPlaceholder='HH'
        locale={locale}
        monthPlaceholder='MM'
        minutePlaceholder='mm'
        name={name}
        onChange={(value) => this.handleDateTimeRangeChange(name, value)}
        value={utcValue}
        yearPlaceholder='YYYY'
      />
    );
  }

  render () {
    return (
      <div className="datetime__module">
        <div className="datetime">
          <div className="datetime__range">
            <ul className="datetime__internal">
              <li>
                { this.renderDateRangeDropDown() }
              </li>
              <li>
                { this.renderDateTimeRange('startDateTime') }
              </li>
              <li>
                <span> to </span>
              </li>
              <li>
                { this.renderDateTimeRange('endDateTime') }
              </li>
              <li className="selector__hrformat">
                { this.renderHourFormatSelect() }
              </li>
            </ul>
          </div>
          <div className="datetime__wrapper">
            <h3>Date and Time Range</h3>
          </div>
        </div>
        <div className="datetime__clear">
          <button
            className="button button--small"
            onClick={this.clear}
          >
            Clear Selection
          </button>
        </div>
      </div>
    );
  }
}

Datepicker.defaultProps = {
  dateRange: defaultDateRange,
  startDateTime: null,
  endDateTime: null,
  hourFormat: defaultHourFormat
};

Datepicker.propTypes = {
  name: PropTypes.string,
  dateRange: PropTypes.oneOf(allDateRanges),
  startDateTime: PropTypes.string,
  endDateTime: PropTypes.string,
  hourFormat: PropTypes.oneOf(allHourFormats),
  onChange: PropTypes.func
};

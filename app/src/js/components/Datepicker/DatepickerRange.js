import isEmpty from 'lodash/isEmpty';
import isNil from 'lodash/isNil';
import moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import withQueryParams from 'react-router-query-params';
import noop from 'lodash/noop';
import {
  DATEPICKER_DATECHANGE,
  DATEPICKER_DROPDOWN_FILTER,
  DATEPICKER_HOUR_FORMAT
} from '../../actions/types';
import {
  allDateRanges,
  allHourFormats,
  dropdownValue,
  dateTimeFormat,
  urlDateFormat,
  urlDateProps,
  findDateRangeByValue
} from '../../utils/datepicker';
import SimpleDropdown from '../DropDown/simple-dropdown';
import Datepicker from './Datepicker';

/*
 * If this is a shared URL, grab the date and time and update the datepicker
 * state to reflect the values.
 * @param {Object} props - Home component's input props.
 */
const updateDatepickerStateFromQueryParams = (props) => {
  const { queryParams } = props;

  if (!isEmpty(queryParams)) {
    const values = {};

    Object.keys(queryParams).forEach((key) => {
      if (urlDateProps.includes(key)) {
        values[key] = moment.utc(queryParams[key], urlDateFormat).valueOf();
      }
    });

    values.dateRange = dropdownValue(values);
    props.dispatch({
      type: DATEPICKER_DATECHANGE,
      data: { ...props.datepicker, ...values }
    });
  }
};

/**
 * Component representing the Datepicker.
 * Use by adding <Datepicker />. Update the connected state.datepicker to make changes.
 */
class DatepickerRange extends React.PureComponent {
  constructor (props) {
    super(props);
    this.onChange = props.onChange || noop;
    this.handleDropdownChange = this.handleDropdownChange.bind(this);
    this.handleHourFormatChange = this.handleHourFormatChange.bind(this);
    this.handleDateTimeRangeChange = this.handleDateTimeRangeChange.bind(this);
    this.clear = this.clear.bind(this);
    this.refresh = this.refresh.bind(this);
  }

  componentDidMount () {
    updateDatepickerStateFromQueryParams(this.props);
  }

  refresh (e) {
    const { value, label } = this.props.dateRange;
    if (label !== 'Custom') {
      this.props.dispatch(this.dispatchDropdownUpdate(value, label));
    }
  }

  clear () {
    const { value, label } = findDateRangeByValue('Custom');
    this.props.dispatch(this.dispatchDropdownUpdate(value, label));
  }

  dispatchDropdownUpdate (value, label) {
    return (dispatch, getState) => {
      dispatch({
        type: DATEPICKER_DROPDOWN_FILTER,
        data: { dateRange: { value, label } }
      });
      const datepickerState = getState().datepicker;
      this.updateQueryParams(datepickerState);
      this.onChange();
    };
  }

  handleDropdownChange (id, optionValue, option) {
    const { value, label } = option;
    this.props.dispatch(this.dispatchDropdownUpdate(value, label));
  }

  handleHourFormatChange (id, value) {
    this.props.dispatch({
      type: DATEPICKER_HOUR_FORMAT,
      data: value
    });
  }

  handleDateTimeRangeChange (name, newValue) {
    // User input is in UTC, but the DateTimePicker component interprets it's
    // data as local time.  So we need convert the Date value to UTC.
    let utcValue = null;
    if (newValue !== null) {
      utcValue = moment.utc(moment(newValue).format(dateTimeFormat)).valueOf();
      if (Number.isNaN(+utcValue)) return;
    }
    const updatedProps = {
      startDateTime: this.props.startDateTime,
      endDateTime: this.props.endDateTime,
      [name]: utcValue
    };
    updatedProps.dateRange = findDateRangeByValue('Custom');
    this.props.dispatch({ type: DATEPICKER_DATECHANGE, data: updatedProps });
    this.updateQueryParams(updatedProps);
    this.onChange();
  }

  updateQueryParams (newProps) {
    const updatedQueryParams = { ...this.props.queryParams };
    urlDateProps.forEach((time) => {
      let urlValue;
      if (newProps[time] !== null) {
        urlValue = moment.utc(newProps[time]).format(urlDateFormat);
      }
      updatedQueryParams[time] = urlValue;
    });
    this.props.setQueryParams(updatedQueryParams);
  }

  renderDateTimeRange (name, label) {
    const { hourFormat } = this.props;
    const value = this.props[name];
    const locale = hourFormat === '24HR' ? 'en-GB' : 'en-US';
    const format = `MM/dd/yyyy ${hourFormat === '24HR' ? 'HH:mm' : 'hh:mm a'}`;

    const utcValue = isNil(value)
      ? null
      : moment(moment.utc(value).format(dateTimeFormat)).toDate();

    return (
      <Datepicker
        format={format}
        locale={locale}
        name={name}
        label={label}
        onChange={(id, date) => this.handleDateTimeRangeChange(name, date)}
        value={utcValue}
        minDate = {new Date(0, 0, 0)}
        maxDate = {new Date(9999, 12, 31)}
      />
    );
  }

  render () {
    return (
      <div className='datetime__module'>
        <div className='datetime'>
          <div className='datetime__range'>
            <ul className='datetime__internal'>
              <li>
                <SimpleDropdown
                  className='datetime dropdown__dtrange'
                  label='Duration'
                  value={this.props.dateRange}
                  onChange={this.handleDropdownChange}
                  options={allDateRanges}
                />
              </li>
              <li data-cy='startDateTime'>
                {this.renderDateTimeRange('startDateTime', 'Start Date and Time')}
              </li>
              <li data-cy='endDateTime'>
                {this.renderDateTimeRange('endDateTime', 'End Date and Time')}
              </li>
              <li className='selector__hrformat' data-cy='hourFormat'>
                <SimpleDropdown
                  className='datetime selector__hrformat'
                  label='Time Format'
                  value={this.props.hourFormat}
                  onChange={this.handleHourFormatChange}
                  options={allHourFormats}
                />
              </li>
              {this.props.hideWrapper || (
                <li className='datetime__clear'>
                  <button
                    className='button button--secondary button--small'
                    onClick={this.clear}
                    data-cy='datetime-clear'
                  >
                    Clear All
                  </button>
                </li>
              )}
            </ul>
          </div>
          {this.props.hideWrapper || (
            <div className='datetime__wrapper'>
              <ul className='datetime__header'>
                <li>
                  <h3>Date and Time Range</h3>
                </li>
                <li>
                  <div className='datetime__refresh'>
                    <button
                      className='button button--small'
                      onClick={this.refresh}
                      data-cy='datetime-refresh'
                    >
                      Refresh Time
                    </button>
                  </div>
                </li>
              </ul>
              <hr></hr>
            </div>
          )}
        </div>
      </div>
    );
  }
}

DatepickerRange.propTypes = {
  name: PropTypes.string,
  dateRange: PropTypes.shape({
    value: PropTypes.node,
    label: PropTypes.string
  }),
  startDateTime: PropTypes.number,
  endDateTime: PropTypes.number,
  hourFormat: PropTypes.oneOf(allHourFormats.map((a) => a.label)),
  queryParams: PropTypes.object,
  setQueryParams: PropTypes.func,
  onChange: PropTypes.func,
  dispatch: PropTypes.func,
  hideWrapper: PropTypes.bool,
};

export default withRouter(
  withQueryParams()(connect((state) => state.datepicker)(DatepickerRange))
);

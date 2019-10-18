'use strict';
import c from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import Autocomplete from 'react-autocomplete';
import isEmpty from 'lodash.isempty';

function shouldItemRender ({ label }, value) {
  return label.toLowerCase().indexOf(value) >= 0;
}

function renderItem (item, highlighted) {
  return <div className={c('autocomplete__select', {
    'autocomplete__select--highlighted': highlighted
  })} key={item.value}>{item.label}</div>;
}

function renderMenu (items, value, style) {
  return (
    <div className='autocomplete__menu' style={style} children={items} />
  );
}

/**
 * Translator for status objects.
 *
 * @param {Object} statusObject
 * @param {string} status - url query parameter to match. e.g. "running", "completed", "failed"
 * @returns {string} - either the correct label from the status Object, or the input status.
 */
const statusToLabel = (statusObject = {}, status) => {
  let result = Object.keys(statusObject).filter(
    (label) => statusObject[label] === status
  );
  if (result.length) return result[0];
  return status;
};

/**
 * Retrieve initial value for component based on react-router's location.
 *
 * @param {Object} props - react component props
 * @returns {string} - value of this component's query string from the url .
 */
function initialValueFromProps (props) {
  const { location, dispatch, action, paramKey } = props;

  let initialValue = '';
  if (!isEmpty(location.query) &&
       Object.hasOwnProperty.call(location.query, paramKey)) {
    dispatch(action({key: paramKey, value: location.query[paramKey]}));
    initialValue = location.query[paramKey];
  }
  return initialValue;
};

class Dropdown extends React.Component {
  constructor (props) {
    super(props);
    this.displayName = 'Dropdown';
    const initialValue = statusToLabel(props.options, initialValueFromProps(props));
    this.state = {
      value: initialValue
    };
    this.onSelect = this.onSelect.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  updateHistory (router, location, value) {
    let nextQuery = { ...location.query };
    if (value.length) {
      nextQuery = { ...nextQuery, [this.props.paramKey]: value };
    } else {
      delete nextQuery[this.props.paramKey];
    }
    if (location.query[this.props.paramKey] !== nextQuery[this.props.paramKey]) {
      location.query = nextQuery;
      router.push(location);
    }
  }

  componentDidUpdate (prevProps, prevState, snapshot) {
    if (this.props.location.query[this.props.paramKey] !== prevProps.location.query[this.props.paramKey]) {
      let value = this.props.location.query[this.props.paramKey];
      this.props.dispatch(this.props.action({ key: this.props.paramKey, value }));
      if (value) value = statusToLabel(this.props.options, value);
      this.setState({value}); // eslint-disable-line react/no-did-update-set-state
    }
  }

  componentDidMount () {
    const { dispatch, getOptions } = this.props;
    if (getOptions) { dispatch(getOptions()); }
  }

  componentWillUnmount () {
    const { dispatch, clear } = this.props;
    dispatch(clear(this.props.paramKey));
  }

  onSelect (selected, item) {
    const { dispatch, action, router, location } = this.props;
    dispatch(action({ key: this.props.paramKey, value: selected }));
    this.setState({ value: item.label });
    this.updateHistory(router, location, item.value);
  }

  onChange (e) {
    const { dispatch, clear, router, location } = this.props;
    const { value } = e.target;
    this.setState({ value });
    if (!value.length) {
      dispatch(clear(this.props.paramKey));
      this.updateHistory(router, location, '');
    }
  }

  render () {
    // `options` are expected in the following format:
    // {displayValue1: optionElementValue1, displayValue2, optionElementValue2, ...}
    const { options, label, paramKey } = this.props;
    const items = options ? Object.keys(options).map(label => ({label, value: options[label]})) : [];

    // Make sure this form ID is unique!
    // If needed in future, could add MD5 hash of stringified options,
    // or a UUID library such as `hat()`
    const formID = `form-${label}-${paramKey}`;

    return (
      <div className='filter__item'>
        {label ? <label htmlFor={formID}>{label}</label> : null}
        <form className='form-group__element' id={formID}>
          <Autocomplete
            getItemValue={item => item.value}
            items={items}
            renderItem={renderItem}
            shouldItemRender={shouldItemRender}
            value={this.state.value}
            onChange={this.onChange}
            onSelect={this.onSelect}
            renderMenu={renderMenu}
          />
        </form>
      </div>
    );
  }
}

Dropdown.propTypes = {
  dispatch: PropTypes.func,
  options: PropTypes.object,
  getOptions: PropTypes.func,
  action: PropTypes.func,
  clear: PropTypes.func,
  paramKey: PropTypes.string,
  label: PropTypes.any,
  location: PropTypes.object,
  router: PropTypes.object
};

export default withRouter(connect()(Dropdown));
